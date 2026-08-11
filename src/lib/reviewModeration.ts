/** Проверка имени и текста отзыва: маты и ссылки */

const LINK_RE =
  /(?:https?:\/\/|www\.|t\.me\/|vk\.com\/|instagram\.com\/|wa\.me\/|bit\.ly\/)|(?:[a-z0-9-]+\.)+(?:com|ru|by|net|org|info|me|cc|xyz|online|site|shop)\b/i

const PROFANITY_STEMS = [
  'бля',
  'бляд',
  'блят',
  'еба',
  'ебан',
  'ебат',
  'ебл',
  'ебу',
  'еби',
  'еблан',
  'пизд',
  'пезд',
  'хуй',
  'хуе',
  'хуя',
  'хер',
  'хрен',
  'муда',
  'мудил',
  'сука',
  'сучк',
  'гандон',
  'гондон',
  'залуп',
  'дроч',
  'перд',
  'срат',
  'говн',
  'дерьм',
  'пидор',
  'пидар',
  'педик',
  'чмо',
  'долбо',
  'уеб',
  'выеб',
  'охуе',
  'охере',
  'нахер',
  'нахуй',
  'похуй',
  'похер',
  'спизд',
  'выпизд',
  'хуйло',
  'хуйл',
  'шалав',
  'шлюх',
  'епта',
  'епть',
  'йопта',
  'ебта',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'dick',
  'cunt',
]

/** Однозначные замены */
const LOOKALIKE_SINGLE: Record<string, string> = {
  '0': 'о',
  '5': 'с',
  '6': 'б',
  '9': 'д',
  a: 'а',
  b: 'б',
  c: 'с',
  e: 'е',
  g: 'г',
  h: 'н',
  i: 'и',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'п',
  o: 'о',
  p: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  w: 'ш',
  x: 'х',
  y: 'у',
  z: 'з',
  '@': 'а',
  $: 'с',
  '*': '',
  '€': 'е',
  '£': 'е',
  '¥': 'у',
  '†': 'т',
  '‡': 'т',
  α: 'а',
  β: 'б',
  ε: 'е',
  ι: 'и',
  κ: 'к',
  ο: 'о',
  ρ: 'р',
  τ: 'т',
  υ: 'у',
  χ: 'х',
  // частые «похожие» юникод-буквы
  а: 'а', // cyrillic already
  'ɑ': 'а',
  'а̀': 'а',
  'е́': 'е',
  'і': 'и', // ukrainian i
  'ї': 'и',
  'є': 'е',
  'ґ': 'г',
}

/**
 * Неоднозначные символы → несколько вариантов
 * (3 ≈ е и з, 1 ≈ и и л, и т.д.)
 */
const LOOKALIKE_AMBIGUOUS: Record<string, string[]> = {
  '1': ['и', 'л'],
  '3': ['е', 'з'],
  '4': ['ч', 'а'],
  '7': ['т', 'л'],
  '8': ['в', 'б'],
  r: ['г', 'р'],
  'ǃ': ['и', 'л'],
  '!': ['и'],
  '|': ['и', 'л'],
  '¦': ['и', 'л'],
}

const MAX_VARIANTS = 64

function collapseRepeats(value: string): string {
  return value.replace(/(.)\1{2,}/gu, '$1$1')
}

/** Все нормализованные варианты строки (без пробелов/мусора) */
export function normalizeVariants(value: string): string[] {
  const lower = value.toLowerCase().replace(/ё/g, 'е')
  let variants = ['']

  for (const ch of lower) {
    let options: string[] | null = null

    if (LOOKALIKE_AMBIGUOUS[ch]) {
      options = LOOKALIKE_AMBIGUOUS[ch]
    } else if (Object.prototype.hasOwnProperty.call(LOOKALIKE_SINGLE, ch)) {
      const mapped = LOOKALIKE_SINGLE[ch]
      options = mapped === '' ? [''] : [mapped]
    } else if (/[a-zа-я]/u.test(ch)) {
      options = [ch]
    } else {
      // пробелы, кавычки «», пунктуация — выкидываем
      continue
    }

    const next: string[] = []
    for (const prefix of variants) {
      for (const opt of options) {
        next.push(prefix + opt)
        if (next.length >= MAX_VARIANTS) break
      }
      if (next.length >= MAX_VARIANTS) break
    }
    variants = next.length > 0 ? next : variants
    if (variants.length >= MAX_VARIANTS) break
  }

  const unique = new Set(variants.map(collapseRepeats).filter(Boolean))
  return [...unique]
}

export function containsLink(value: string): boolean {
  return LINK_RE.test(value)
}

export function containsProfanity(value: string): boolean {
  const variants = normalizeVariants(value)
  if (variants.length === 0) return false

  return PROFANITY_STEMS.some((stem) => {
    const needle = stem.replace(/ё/g, 'е')
    return variants.some((variant) => variant.includes(needle))
  })
}

export function validateReviewFields(name: string, text: string): string | null {
  const n = name.trim()
  const t = text.trim()

  if (n.length < 2) return 'Укажите имя'
  if (n.length > 40) return 'Имя слишком длинное'
  if (/\s/.test(n)) return 'В имени можно только одно слово — без пробелов'
  if (!/^[a-zA-Zа-яА-ЯёЁ-]+$/u.test(n)) {
    return 'В имени используйте только буквы'
  }
  if (t.length < 20) return 'Напишите отзыв чуть подробнее (от 20 символов)'
  if (t.length > 800) return 'Отзыв слишком длинный'

  if (containsLink(n) || containsLink(t)) {
    return 'В имени и отзыве нельзя указывать ссылки'
  }
  if (containsProfanity(n) || containsProfanity(t)) {
    return 'Пожалуйста, без грубых слов — напишите отзыв иначе'
  }

  return null
}

export function isValidStoredReview(name: string, text: string): boolean {
  return validateReviewFields(name, text) === null
}
