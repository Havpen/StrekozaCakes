import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const SITE_URL = 'https://havpen.github.io/StrekozaCakes'

const faq = [
  [
    'За сколько нужно заказывать муссовые изделия?',
    'Муссовые изделия готовим только по предзаказу — минимум за 3 дня до даты получения.',
  ],
  [
    'Какая предоплата?',
    'За муссовые изделия после согласования заказа нужна предоплата 50%.',
  ],
  [
    'Доставка входит в стоимость?',
    'Нет. Стоимость доставки по Гомелю оплачивается отдельно. Также доступен самовывоз.',
  ],
  [
    'Что можно заказать у STREKOZA?',
    'Корпусные пирожные, муссовые изделия (торт, бенто, пирожные), трайфлы и моти.',
  ],
  [
    'Как оформить заказ?',
    'Напишите в Instagram Direct @strekoza_cakes_: идею декора или референс, желаемую позицию, начинку и дату.',
  ],
  [
    'Можно ли выбрать начинку и декор отдельно?',
    'Да. Декор часто выбирают по фото, начинку и дату всегда обсуждаем лично в Direct.',
  ],
  [
    'Цены на сайте окончательные?',
    'На сайте указаны цены «от». Финальная стоимость зависит от веса, декора и состава — согласуем при заказе.',
  ],
]

const products = [
  { name: 'Корпусные пирожные', price: 10, pre: false },
  { name: 'Муссовый торт', price: 85, pre: true },
  { name: 'Муссовый бенто-торт', price: 55, pre: true },
  { name: 'Муссовые пирожные', price: 12, pre: true },
  { name: 'Трайфл', price: 24, pre: false },
  { name: 'Моти', price: 45, pre: false },
]

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Bakery',
      '@id': `${SITE_URL}/#bakery`,
      name: 'STREKOZA CAKES',
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/og-cover.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Гомель',
        addressCountry: 'BY',
      },
      areaServed: { '@type': 'City', name: 'Гомель' },
      sameAs: ['https://www.instagram.com/strekoza_cakes_/'],
      currenciesAccepted: 'BYN',
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#catalog`,
      name: 'Каталог STREKOZA CAKES',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: 'BYN',
            availability: p.pre
              ? 'https://schema.org/PreOrder'
              : 'https://schema.org/LimitedAvailability',
            url: `${SITE_URL}/#catalog`,
          },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faq.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
}

const json = JSON.stringify(graph)
const tag = `    <script type="application/ld+json">${json}</script>\n`
const preload =
  '    <link rel="preload" as="image" href="%BASE_URL%images/img_0574.webp" fetchpriority="high" />\n'

let html = readFileSync('index.html', 'utf8')
html = html.replace(
  /\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/,
  '\n',
)
html = html.replace('</head>', `${tag}${preload}  </head>`)
writeFileSync('index.html', html)
console.log('Injected JSON-LD + LCP preload into index.html')

if (existsSync('public/seo-jsonld.json')) {
  // optional cache for debugging
  writeFileSync('public/seo-jsonld.json', json)
}
