import type { PublicReview } from '@/content/reviewExamples'
import { isValidStoredReview } from '@/lib/reviewModeration'

const API_BASE =
  (import.meta.env.VITE_REVIEWS_API as string | undefined)?.replace(/\/$/, '') ??
  '/api'

const LOCAL_KEY = 'strekoza-reviews-local-v3'
const LEGACY_KEYS = ['strekoza-reviews-local', 'strekoza-reviews-local-v2']

export function reviewsApiConfigured(): boolean {
  return Boolean(API_BASE)
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') || '').includes('application/json')
}

export async function fetchApprovedReviews(): Promise<PublicReview[]> {
  const response = await fetch(`${API_BASE}/reviews.php`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok || !isJsonResponse(response)) {
    throw new Error('offline')
  }
  const data = (await response.json()) as {
    ok?: boolean
    reviews?: Array<{
      id: number
      name: string
      text: string
      photoUrl: string
      createdAt?: string
    }>
  }
  if (!data.ok || !Array.isArray(data.reviews)) {
    throw new Error('offline')
  }
  return data.reviews.map((item) => ({
    id: `api-${item.id}`,
    name: item.name,
    text: item.text,
    photoUrl: item.photoUrl,
    createdAt: item.createdAt,
    source: 'api' as const,
  }))
}

export type SubmitResult = {
  message: string
  review?: PublicReview
  via: 'api' | 'local'
}

export async function submitReview(input: {
  name: string
  text: string
  photo: Blob
  fileName: string
}): Promise<SubmitResult> {
  const body = new FormData()
  body.append('name', input.name)
  body.append('text', input.text)
  body.append('photo', input.photo, input.fileName)

  let apiResponded = false

  try {
    const response = await fetch(`${API_BASE}/reviews.php`, {
      method: 'POST',
      body,
    })

    if (isJsonResponse(response)) {
      apiResponded = true
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean
        message?: string
        error?: string
      } | null

      if (response.ok && data?.ok) {
        return {
          via: 'api',
          message:
            data.message ||
            'Спасибо! Отзыв отправлен и появится после проверки.',
        }
      }

      throw new Error(
        data?.error || 'Не получилось отправить отзыв. Попробуйте ещё раз.',
      )
    }
  } catch (error) {
    if (apiResponded) {
      throw error instanceof Error
        ? error
        : new Error('Не получилось отправить отзыв. Попробуйте ещё раз.')
    }
  }

  // Локально / без PHP: сохраняем в браузере, чтобы отзыв сразу был в ленте
  const photoUrl = await blobToDataUrl(input.photo)
  const review: PublicReview = {
    id: `local-${Date.now()}`,
    name: input.name,
    text: input.text,
    photoUrl,
    createdAt: new Date().toISOString(),
    source: 'example',
  }
  saveLocalReview(review)

  return {
    via: 'local',
    review,
    message: 'Спасибо! Ваш отзыв добавлен.',
  }
}

export function loadLocalReviews(): PublicReview[] {
  try {
    for (const key of LEGACY_KEYS) {
      localStorage.removeItem(key)
    }

    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PublicReview[]
    if (!Array.isArray(parsed)) return []

    const cleaned = parsed.filter(
      (item) =>
        item &&
        typeof item.name === 'string' &&
        typeof item.text === 'string' &&
        typeof item.photoUrl === 'string' &&
        isValidStoredReview(item.name, item.text) &&
        !/епта/i.test(`${item.name} ${item.text}`),
    )

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cleaned))
    }

    return cleaned
  } catch {
    return []
  }
}

function saveLocalReview(review: PublicReview): void {
  const prev = loadLocalReviews()
  localStorage.setItem(LOCAL_KEY, JSON.stringify([review, ...prev].slice(0, 30)))
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Не получилось обработать фото'))
    reader.readAsDataURL(blob)
  })
}

/** Сжатие фото в браузере — меньше нагрузка на shared-хостинг */
export async function compressReviewPhoto(
  file: File,
): Promise<{ blob: Blob; fileName: string }> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Выберите изображение')
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('Фото слишком большое. Выберите файл поменьше.')
  }

  const bitmap = await createImageBitmap(file)
  const maxSide = 1280
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Не получилось обработать фото')
  }
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error('Не получилось обработать фото')),
      'image/jpeg',
      0.82,
    )
  })

  return { blob, fileName: 'review.jpg' }
}
