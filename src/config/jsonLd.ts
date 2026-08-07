import {
  absoluteUrl,
  CITY,
  COUNTRY,
  FAQ_ITEMS,
  INSTAGRAM_URL,
  SITE_NAME,
  SITE_URL,
} from './siteSeo'
import { site } from '../content/site'

function toAbsoluteAsset(path: string): string {
  if (path.startsWith('http')) return path
  const cleaned = path
    .replace(/^\/StrekozaCakes\/?/, '/')
    .replace(/^\//, '')
  return absoluteUrl(`/${cleaned}`)
}

export function buildJsonLdGraph() {
  const bakery = {
    '@type': 'Bakery',
    '@id': `${SITE_URL}/#bakery`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: absoluteUrl('/og-cover.jpg'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY,
      addressCountry: COUNTRY,
    },
    areaServed: {
      '@type': 'City',
      name: CITY,
    },
    sameAs: [INSTAGRAM_URL],
    currenciesAccepted: 'BYN',
  }

  const products = site.catalog.map((item) => {
    const isMousse = item.fillingsKey === 'mousse'
    return {
      '@type': 'Product',
      name: item.name,
      description: item.description,
      image: toAbsoluteAsset(item.cover),
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      offers: {
        '@type': 'Offer',
        price: item.priceFrom,
        priceCurrency: 'BYN',
        availability: isMousse
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/LimitedAvailability',
        url: `${SITE_URL}/#catalog`,
      },
    }
  })

  const itemList = {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#catalog`,
    name: 'Каталог STREKOZA CAKES',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: product,
    })),
  }

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [bakery, itemList, faqPage],
  }
}
