import { asset } from '../lib/asset'

export type SliceSlide = {
  /** Фото в разрезе / крупный план начинки */
  src: string
  /** Подпись начинки под фото в карусели */
  filling: string
  alt?: string
}

export type CatalogItem = {
  id: string
  name: string
  detail: string
  priceFrom: number
  note?: string
  description: string
  /** Обложка карточки в сетке каталога */
  cover: string
  /** Карусель разрезов именно этой позиции */
  slices: SliceSlide[]
  /** Ключ группы начинок из site.fillings (для блока на странице) */
  fillingsKey?: 'mousse' | 'trifle' | 'mochi' | 'pastries'
}

export type FillingItem = {
  name: string
  color: string
}

export type FillingGroup = {
  id: 'mousse' | 'trifle' | 'mochi' | 'pastries'
  title: string
  titleAccent: string
  note?: string
  noteAccent?: string
  items: FillingItem[]
}

export type GalleryItem = {
  src: string
  alt: string
}

export type Review = {
  name: string
  text: string
}

export const site = {
  brand: 'STREKOZA',
  tagline: 'Крафтовые торты и десерты на заказ в Гомеле',
  heroSupport:
    'Заказы и доставка по Гомелю. Декор выбираете вы — начинку и дату подберём в Direct.',

  /** Подставьте свой @ник Instagram */
  instagramHandle: 'strekoza_cakes_',
  city: 'Гомель',

  get instagramUrl() {
    return `https://www.instagram.com/${this.instagramHandle}/`
  },

  get directUrl() {
    return `https://ig.me/m/${this.instagramHandle}`
  },

  /** Текст заказа для Instagram Direct (?text=) */
  buildOrderMessage(order: {
    name: string
    detail?: string
    priceFrom: number
    filling?: string | null
  }) {
    // Компактный однострочник лучше подхватывается мобильным приложением Instagram
    const parts = [`Заказ: ${order.name}`]
    if (order.filling) parts.push(`начинка «${order.filling}»`)
    parts.push(`от ${order.priceFrom} BYN`)
    if (order.detail) parts.push(order.detail)
    return `${parts.join(' · ')}. Гомель · подскажите по срокам и оформлению.`
  },

  directOrderUrl(order: {
    name: string
    detail?: string
    priceFrom: number
    filling?: string | null
  }) {
    const text = this.buildOrderMessage(order)
    // ig.me?text= — единственный нативный вариант; на части телефонов текст уже в поле ввода
    return `${this.directUrl}?text=${encodeURIComponent(text)}`
  },

  heroImage: asset('images/img_0574.webp'),

  catalog: [
    {
      id: 'mousse-cake',
      name: 'Муссовый торт',
      detail: 'вес 1 кг',
      priceFrom: 85,
      cover: asset('images/img_0574.webp'),
      fillingsKey: 'mousse',
      description:
        'Торт с декором на ваш вкус. Начинку и дату обсуждаем в Direct — подберём вариант именно под ваш праздник.',
      slices: [
        {
          src: asset('images/img_0574.webp'),
          filling: 'вишня + шоколад',
          alt: 'Муссовый торт, начинка вишня и шоколад',
        },
        {
          src: asset('images/img_2482.webp'),
          filling: 'клубника + хрустящий слой',
          alt: 'Муссовый торт, начинка клубника',
        },
        {
          src: asset('images/img_9638.webp'),
          filling: 'персик + хрустящий слой',
          alt: 'Муссовый торт, начинка персик',
        },
        {
          src: asset('images/img_0391.webp'),
          filling: 'лимон + хрустящий слой',
          alt: 'Муссовый торт, начинка лимон',
        },
        {
          src: asset('images/img_8500.webp'),
          filling: 'банан + сгущенка',
          alt: 'Муссовый торт, начинка банан и сгущенка',
        },
      ],
    },
    {
      id: 'mousse-bento',
      name: 'Муссовый бенто-торт',
      detail: 'вес 500 г',
      priceFrom: 55,
      cover: asset('images/img_7921.webp'),
      fillingsKey: 'mousse',
      description:
        'Компактный бенто с аккуратным декором. Идеален для небольшого торжества или подарка.',
      slices: [
        {
          src: asset('images/img_7921.webp'),
          filling: 'вишня + шоколад',
          alt: 'Бенто-торт, начинка вишня и шоколад',
        },
        {
          src: asset('images/img_2713.webp'),
          filling: 'клубника + хрустящий слой',
          alt: 'Бенто-торт, начинка клубника',
        },
        {
          src: asset('images/img_1486.webp'),
          filling: 'персик + хрустящий слой',
          alt: 'Бенто-торт, начинка персик',
        },
        {
          src: asset('images/img_6881.webp'),
          filling: 'лимон + хрустящий слой',
          alt: 'Бенто-торт, начинка лимон',
        },
        {
          src: asset('images/img_1258.webp'),
          filling: 'банан + сгущенка',
          alt: 'Бенто-торт, начинка банан и сгущенка',
        },
      ],
    },
    {
      id: 'mousse-pastries',
      name: 'Муссовые пирожные',
      detail: 'набор от 4 шт',
      priceFrom: 10,
      cover: asset('images/img_9967.webp'),
      fillingsKey: 'pastries',
      description:
        'Фруктовые муссовые пирожные в разрезе — вид начинки виден сразу. Набор от четырёх штук.',
      slices: [
        {
          src: asset('images/pastry-strawberry.webp'),
          filling: 'клубника',
          alt: 'Пирожное-клубника в разрезе',
        },
        {
          src: asset('images/pastry-lemon.webp'),
          filling: 'лимон',
          alt: 'Пирожное-лимон в разрезе',
        },
        {
          src: asset('images/pastry-peach.webp'),
          filling: 'персик',
          alt: 'Пирожное-персик в разрезе',
        },
        {
          src: asset('images/pastry-cherry-chocolate.webp'),
          filling: 'вишня-шоколад',
          alt: 'Пирожное вишня-шоколад в разрезе',
        },
        {
          src: asset('images/pastry-apple-cinnamon.webp'),
          filling: 'яблоко-корица',
          alt: 'Пирожное яблоко-корица в разрезе',
        },
        {
          src: asset('images/pastry-banana.webp'),
          filling: 'банан',
          alt: 'Пирожное-банан в разрезе',
        },
        {
          src: asset('images/pastry-pineapple.webp'),
          filling: 'ананас',
          alt: 'Пирожное-ананас',
        },
        {
          src: asset('images/pastry-orange.webp'),
          filling: 'апельсин',
          alt: 'Пирожное-апельсин',
        },
        {
          src: asset('images/pastry-raspberry.webp'),
          filling: 'малина',
          alt: 'Пирожное-малина',
        },
        {
          src: asset('images/pastry-currant.webp'),
          filling: 'смородина',
          alt: 'Пирожное-смородина',
        },
      ],
    },
    {
      id: 'mochi',
      name: 'Моти',
      detail: 'в продаже от 4 шт',
      priceFrom: 45,
      cover: asset('images/img_1124.webp'),
      fillingsKey: 'mochi',
      description:
        'Нежные моти с начинками на выбор. Заказ от четырёх штук.',
      slices: [
        {
          src: asset('images/mochi-nutella.webp'),
          filling: 'нутела',
          alt: 'Моти в разрезе, начинка нутела',
        },
        {
          src: asset('images/mochi-rafaello.webp'),
          filling: 'рафаэлло',
          alt: 'Моти в разрезе, начинка рафаэлло',
        },
        {
          src: asset('images/mochi-strawberry-cream.webp'),
          filling: 'клубника-сливки',
          alt: 'Моти в разрезе, начинка клубника-сливки',
        },
        {
          src: asset('images/mochi-raspberry-yogurt.webp'),
          filling: 'малиновый йогурт',
          alt: 'Моти в разрезе, начинка малиновый йогурт',
        },
        {
          src: asset('images/mochi-lemon.webp'),
          filling: 'лимон',
          alt: 'Моти в разрезе, начинка лимон',
        },
        {
          src: asset('images/mochi-cherry-chocolate.webp'),
          filling: 'вишня-шоколад',
          alt: 'Моти в разрезе, начинка вишня-шоколад',
        },
        {
          src: asset('images/mochi-peach.webp'),
          filling: 'персик',
          alt: 'Моти в разрезе, начинка персик',
        },
        {
          src: asset('images/mochi-currant-yogurt.webp'),
          filling: 'йогурт со смородиной',
          alt: 'Моти в разрезе, начинка йогурт со смородиной',
        },
        {
          src: asset('images/mochi-oreo.webp'),
          filling: 'орео',
          alt: 'Моти в разрезе, начинка орео',
        },
        {
          src: asset('images/mochi-mango.webp'),
          filling: 'манго',
          alt: 'Моти в разрезе, начинка манго',
        },
      ],
    },
    {
      id: 'trifle',
      name: 'Трайфл',
      detail: 'от 2 шт · 12 BYN за шт',
      priceFrom: 24,
      note: '12 BYN за одну штуку',
      cover: asset('images/img_0365.webp'),
      fillingsKey: 'trifle',
      description:
        'Десерт в стаканчике — удобно для праздников и к чаю. В продаже от двух штук.',
      slices: [
        {
          src: asset('images/img_0365.webp'),
          filling: 'орех + сгущенка',
          alt: 'Трайфл, орех и сгущенка',
        },
        {
          src: asset('images/img_1152.webp'),
          filling: 'вишня + шоколад',
          alt: 'Трайфл в разрезе, вишня и шоколад',
        },
        {
          src: asset('images/img_8838.webp'),
          filling: 'красный бархат с клубникой',
          alt: 'Трайфл в разрезе, красный бархат',
        },
        {
          src: asset('images/img_8469.webp'),
          filling: 'лимон',
          alt: 'Трайфл, лимон',
        },
        {
          src: asset('images/img_1162.webp'),
          filling: 'банан + сгущенка',
          alt: 'Трайфл, банан и сгущенка',
        },
        {
          src: asset('images/img_0368.webp'),
          filling: 'смородина',
          alt: 'Трайфл, смородина',
        },
        {
          src: asset('images/img_8845.webp'),
          filling: 'oreo',
          alt: 'Трайфл, oreo',
        },
      ],
    },
  ] satisfies CatalogItem[],

  fillings: [
    {
      id: 'mousse',
      title: 'Начинки',
      titleAccent: 'муссовых',
      note: 'изделий',
      items: [
        { name: 'вишня + шоколад', color: '#9E0000' },
        { name: 'клубника + хрустящий слой', color: '#E8A0B0' },
        { name: 'персик + хрустящий слой', color: '#E89A5B' },
        { name: 'лимон + хрустящий слой', color: '#E8D48A' },
        { name: 'банан + сгущенка', color: '#D4A017' },
      ],
    },
    {
      id: 'trifle',
      title: 'Начинки',
      titleAccent: 'трайфлов',
      note: 'Работаю на',
      noteAccent: 'кремчизе',
      items: [
        { name: 'вишня + шоколад', color: '#9E0000' },
        { name: 'красный бархат с клубникой', color: '#E8A0B0' },
        { name: 'орех + сгущенка', color: '#E89A5B' },
        { name: 'лимон', color: '#E8D48A' },
        { name: 'банан + сгущенка', color: '#D4A017' },
        { name: 'смородина', color: '#5C3A6E' },
        { name: 'oreo', color: '#4A3728' },
      ],
    },
    {
      id: 'mochi',
      title: 'Начинки',
      titleAccent: 'моти',
      items: [
        { name: 'нутела', color: '#6B3A2A' },
        { name: 'рафаэлло', color: '#F2E8D5' },
        { name: 'клубника-сливки', color: '#E8A0B0' },
        { name: 'малиновый йогурт', color: '#C45A7A' },
        { name: 'лимон', color: '#E8D48A' },
        { name: 'вишня-шоколад', color: '#9E0000' },
        { name: 'персик', color: '#E89A5B' },
        { name: 'йогурт со смородиной', color: '#7A5A8E' },
        { name: 'орео', color: '#4A3728' },
        { name: 'манго', color: '#E8B84A' },
      ],
    },
    {
      id: 'pastries',
      title: 'Начинки',
      titleAccent: 'пирожных',
      items: [
        { name: 'клубника', color: '#E88A8A' },
        { name: 'лимон', color: '#E8D48A' },
        { name: 'персик', color: '#E89A5B' },
        { name: 'вишня-шоколад', color: '#9E0000' },
        { name: 'яблоко-корица', color: '#6B7A3A' },
        { name: 'банан', color: '#D4A017' },
        { name: 'ананас', color: '#E8B84A' },
        { name: 'апельсин', color: '#E87A3A' },
        { name: 'малина', color: '#C45A7A' },
        { name: 'смородина', color: '#5C3A6E' },
      ],
    },
  ] satisfies FillingGroup[],

  gallery: [
    { src: asset('images/img_0574.webp'), alt: 'Муссовый торт с бархатным покрытием' },
    { src: asset('images/img_1109.webp'), alt: 'Муссовые пирожные геометрической формы' },
    { src: asset('images/img_0365.webp'), alt: 'Трайфлы в крафтовой коробке' },
    { src: asset('images/img_1123.webp'), alt: 'Десерт STREKOZA' },
    { src: asset('images/img_1253.webp'), alt: 'Крафтовый торт на заказ' },
    { src: asset('images/img_1341.webp'), alt: 'Декор торта' },
    { src: asset('images/img_1701.webp'), alt: 'Муссовый десерт' },
    { src: asset('images/img_2443.webp'), alt: 'Праздничный торт' },
    { src: asset('images/img_2711.webp'), alt: 'Авторский десерт' },
    { src: asset('images/img_6733.webp'), alt: 'Торт STREKOZA' },
    { src: asset('images/img_7196.webp'), alt: 'Пирожные на заказ' },
    { src: asset('images/img_8077.webp'), alt: 'Тематический декор' },
    { src: asset('images/img_8468.webp'), alt: 'Крафтовые сладости' },
    { src: asset('images/img_9097.webp'), alt: 'Десерт в подарочной упаковке' },
    { src: asset('images/img_9964.webp'), alt: 'Муссовый торт крупным планом' },
  ] satisfies GalleryItem[],

  orderSteps: [
    {
      title: 'Напишите в Direct',
      text: 'Пришлите референс декора из ленты или опишите идею.',
    },
    {
      title: 'Подберём начинку и дату',
      text: 'Обсудим вкус, вес и удобный день — всё индивидуально.',
    },
    {
      title: 'Предоплата',
      text: 'После согласования фиксируем заказ обязательной предоплатой.',
    },
    {
      title: 'Доставка или самовывоз',
      text: 'По Гомелю — Яндекс Доставка или самовывоз, как удобнее.',
    },
  ],

  conditions: [
    {
      title: 'Предоплата обязательна',
      text: 'Заказ запускается в работу только после предоплаты.',
    },
    {
      title: 'Доставка по Гомелю',
      text: 'Доставляем по Гомелю через Яндекс или забираете самовывозом.',
    },
    {
      title: 'Начинка и дата',
      text: 'Декор можно выбрать по фото, вкус и дату всегда обсуждаем лично.',
    },
  ],

  /** Добавьте отзывы сюда — блок появится автоматически */
  reviews: [] as Review[],

  reviewsPlaceholder: {
    title: 'Отзывы',
    text: 'Скоро здесь появятся истории клиентов. А пока — спрашивайте всё в Direct.',
  },
}

export type SiteContent = typeof site
