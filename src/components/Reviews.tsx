import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { REVIEW_EXAMPLES, type PublicReview } from '@/content/reviewExamples'
import { validateReviewFields } from '@/lib/reviewModeration'
import {
  compressReviewPhoto,
  fetchApprovedReviews,
  loadLocalReviews,
  submitReview,
} from '@/lib/reviewsApi'

function mergeReviews(
  remote: PublicReview[],
  local: PublicReview[],
): PublicReview[] {
  const base = remote.length > 0 ? remote : REVIEW_EXAMPLES
  const seen = new Set(base.map((item) => `${item.name}|${item.text}`))
  const extras = local.filter((item) => !seen.has(`${item.name}|${item.text}`))
  return [...extras, ...base]
}

export function Reviews() {
  const formId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [reviews, setReviews] = useState<PublicReview[]>(() =>
    mergeReviews([], loadLocalReviews()),
  )
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const list = await fetchApprovedReviews()
        if (cancelled) return
        setReviews(mergeReviews(list, loadLocalReviews()))
      } catch {
        if (!cancelled) {
          setReviews(mergeReviews([], loadLocalReviews()))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!photo) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  const scrollByCard = (direction: -1 | 1) => {
    const node = scrollerRef.current
    if (!node) return
    const cards = [...node.querySelectorAll<HTMLElement>('.review--photo')]
    if (cards.length === 0) return

    const center = node.scrollLeft + node.clientWidth / 2
    let current = 0
    let best = Number.POSITIVE_INFINITY
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(cardCenter - center)
      if (dist < best) {
        best = dist
        current = i
      }
    })

    const next = Math.max(0, Math.min(cards.length - 1, current + direction))
    cards[next]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('idle')
    setMessage('')

    const validationError = validateReviewFields(name, text)
    if (validationError) {
      setStatus('error')
      setMessage(validationError)
      return
    }

    if (!photo) {
      setStatus('error')
      setMessage('Добавьте фото к отзыву')
      return
    }

    setBusy(true)
    try {
      const compressed = await compressReviewPhoto(photo)
      const result = await submitReview({
        name: name.trim(),
        text: text.trim(),
        photo: compressed.blob,
        fileName: compressed.fileName,
      })

      if (result.review) {
        setReviews((prev) => {
          const next = [result.review!, ...prev.filter((item) => item.id !== result.review!.id)]
          return next
        })
        requestAnimationFrame(() => {
          scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
        })
      }

      setStatus('ok')
      setMessage(result.message)
      setName('')
      setText('')
      setPhoto(null)
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Не получилось отправить отзыв. Попробуйте ещё раз.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="section" id="reviews" aria-labelledby="reviews-title">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title" id="reviews-title">
            Отзывы
          </h2>
          <p className="section__lead">
            Истории клиентов с фото. Можно оставить свой — он появится в ленте.
          </p>
        </div>

        <div className="reviews-carousel" aria-live="polite">
          <button
            type="button"
            className="reviews-carousel__nav reviews-carousel__nav--prev"
            aria-label="Предыдущие отзывы"
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>

          <div className="reviews-carousel__track" ref={scrollerRef}>
            {reviews.map((review) => (
              <article className="review review--photo" key={review.id}>
                <div className="review__media">
                  <img
                    src={review.photoUrl}
                    alt={`Отзыв — ${review.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <blockquote className="review__body">
                  <p className="review__text">«{review.text}»</p>
                  <cite className="review__name">{review.name}</cite>
                </blockquote>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="reviews-carousel__nav reviews-carousel__nav--next"
            aria-label="Следующие отзывы"
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>

        <form
          className="review-form review-form--below"
          onSubmit={onSubmit}
          aria-labelledby={`${formId}-title`}
        >
          <h3 className="review-form__title" id={`${formId}-title`}>
            Оставить отзыв
          </h3>
          <p className="review-form__lead">
            Имя — одно слово, плюс текст и фото. Без ссылок.
          </p>

          <div className="review-form__grid">
            <label className="review-form__field">
              <span>Имя</span>
              <input
                name="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value.replace(/\s+/g, ''))
                }
                maxLength={40}
                required
                autoComplete="nickname"
                disabled={busy}
                placeholder="Одно слово"
              />
            </label>

            <label className="review-form__field review-form__field--wide">
              <span>Ваш отзыв</span>
              <textarea
                name="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                minLength={20}
                maxLength={800}
                rows={4}
                required
                disabled={busy}
                placeholder="Расскажите, что заказывали и как всё прошло…"
              />
            </label>

            <div className="review-form__field">
              <span>Фото</span>
              <div className="review-form__file">
                <input
                  id={`${formId}-photo`}
                  className="review-form__file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    setPhoto(event.target.files?.[0] ?? null)
                  }
                  required
                  disabled={busy}
                />
                <label
                  className="btn btn--ink review-form__file-btn"
                  htmlFor={`${formId}-photo`}
                >
                  {photo ? 'Заменить фото' : 'Выбрать фото'}
                </label>
                <span className="review-form__file-name">
                  {photo ? photo.name : 'Файл не выбран'}
                </span>
              </div>
            </div>

            {preview ? (
              <div className="review-form__preview">
                <img src={preview} alt="Превью фото отзыва" />
              </div>
            ) : null}
          </div>

          <button
            className="btn btn--primary review-form__submit"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Отправляем…' : 'Отправить отзыв'}
          </button>

          {message ? (
            <p
              className={`review-form__status review-form__status--${status}`}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
