/** Единый источник SEO-URL. При своём домене меняется здесь (+ vite base). */
export const SITE_URL = 'https://havpen.github.io/StrekozaCakes'
export const SITE_NAME = 'STREKOZA CAKES'
export const SITE_BRAND = 'STREKOZA'
export const INSTAGRAM_HANDLE = 'strekoza_cakes_'
export const CITY = 'Гомель'
export const COUNTRY = 'BY'

export const SITE_TITLE = 'STREKOZA — торты и десерты на заказ в Гомеле'
export const SITE_DESCRIPTION =
  'STREKOZA CAKES — корпусные пирожные, муссовые изделия, трайфлы и моти на заказ в Гомеле. Самовывоз и доставка по городу (доставка отдельно). Заказ в Instagram Direct @strekoza_cakes_.'

export const SITE_H1 =
  'Корпусные пирожные, муссовые десерты, трайфлы и моти на заказ в Гомеле'

export const HERO_SUPPORT =
  'Заказы по Гомелю через Instagram Direct. Декор выбираете вы — начинку и дату согласуем лично. Муссовые изделия — по предзаказу от 3 дней.'

export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`
export const DIRECT_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`
export const OG_IMAGE_PATH = '/og-cover.jpg'

export function absoluteUrl(path = '/'): string {
  const base = SITE_URL.replace(/\/$/, '')
  if (!path || path === '/') return `${base}/`
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export type FaqItem = {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'За сколько нужно заказывать муссовые изделия?',
    answer:
      'Муссовые изделия готовим только по предзаказу — минимум за 3 дня до даты получения.',
  },
  {
    question: 'Какая предоплата?',
    answer:
      'За муссовые изделия после согласования заказа нужна предоплата 50%.',
  },
  {
    question: 'Доставка входит в стоимость?',
    answer:
      'Нет. Стоимость доставки по Гомелю оплачивается отдельно. Также доступен самовывоз.',
  },
  {
    question: 'Что можно заказать у STREKOZA?',
    answer:
      'Корпусные пирожные, муссовые изделия (торт, бенто, пирожные), трайфлы и моти.',
  },
  {
    question: 'Как оформить заказ?',
    answer:
      'Напишите в Instagram Direct @strekoza_cakes_: идею декора или референс, желаемую позицию, начинку и дату.',
  },
  {
    question: 'Можно ли выбрать начинку и декор отдельно?',
    answer:
      'Да. Декор часто выбирают по фото, начинку и дату всегда обсуждаем лично в Direct.',
  },
  {
    question: 'Цены на сайте окончательные?',
    answer:
      'На сайте указаны цены «от». Финальная стоимость зависит от веса, декора и состава — согласуем при заказе.',
  },
]
