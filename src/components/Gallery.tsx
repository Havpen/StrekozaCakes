import { site } from '../content/site'
import { asset } from '@/lib/asset'
import {
  ImageGallery,
  type ImageGalleryItem,
} from '@/components/ui/image-gallery'

/** Чередуем ландшафт / портрет — без Math.random, чтобы вёрстка была стабильной */
const galleryItems: ImageGalleryItem[] = [
  {
    src: asset('images/img_1253.webp'),
    alt: 'Муссовый бенто-торт — клубника',
    title: 'Муссовый бенто-торт',
    desc: 'Клубника',
    ratio: 4 / 5,
  },
  {
    src: asset('images/img_0362.webp'),
    alt: 'Трайфл — орео и сгущенка',
    title: 'Трайфл',
    desc: 'Орео и сгущенка',
    ratio: 16 / 10,
  },
  {
    src: asset('images/img_1124.webp'),
    alt: 'Моти — клубника',
    title: 'Моти',
    desc: 'Клубника',
    ratio: 3 / 4,
  },
  {
    src: asset('images/order-04-pastry-peach-lemon.webp'),
    alt: 'Муссовое пирожное — персик / лимон',
    title: 'Муссовое пирожное',
    desc: 'Персик / лимон',
    ratio: 16 / 11,
  },
  {
    src: asset('images/img_6881.webp'),
    alt: 'Муссовый бенто-торт — вишня-шоколад',
    title: 'Муссовый бенто-торт',
    desc: 'Вишня-шоколад',
    ratio: 4 / 5,
  },
  {
    src: asset('images/img_7196.webp'),
    alt: 'Муссовый торт — клубника',
    title: 'Муссовый торт',
    desc: 'Клубника',
    ratio: 16 / 10,
    objectPosition: 'center 78%',
  },
  {
    src: asset('images/img_1486.webp'),
    alt: 'Муссовый бенто-торт — вишня-шоколад',
    title: 'Муссовый бенто-торт',
    desc: 'Вишня-шоколад',
    ratio: 3 / 4,
    objectPosition: 'center 72%',
  },
  {
    src: asset('images/order-08-cake-mixed.webp'),
    alt: 'Муссовый торт — шоколад / персик / клубника',
    title: 'Муссовый торт',
    desc: 'Шоколад / персик / клубника',
    ratio: 16 / 11,
    objectPosition: 'center 32%',
  },
  {
    src: asset('images/img_0574.webp'),
    alt: 'Муссовый торт — вишня + шоколад',
    title: 'Муссовый торт',
    desc: 'Вишня + шоколад',
    ratio: 4 / 5,
  },
  {
    src: asset('images/img_1109.webp'),
    alt: 'Муссовые пирожные — малина / персик / лимон',
    title: 'Муссовые пирожные',
    desc: 'Малина / персик / лимон',
    ratio: 16 / 10,
  },
  {
    src: asset('images/img_2443.webp'),
    alt: 'Муссовый торт — клубника',
    title: 'Муссовый торт',
    desc: 'Клубника',
    ratio: 3 / 4,
  },
  {
    src: asset('images/img_9964.webp'),
    alt: 'Муссовый торт — персик',
    title: 'Муссовый торт',
    desc: 'Персик',
    ratio: 16 / 11,
  },
].map((item) => ({
  ...item,
  href: site.instagramUrl,
}))

export function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title">Готовые заказы</h2>
          <p className="section__lead">
            Чаще всего заказ начинается с фото декора. Начинку подберём отдельно —
            под ваш вкус и повод.
          </p>
        </div>

        <ImageGallery items={galleryItems} className="gallery-masonry" />

        <p className="gallery__note">
          Больше работ — в Instagram{' '}
          <a href={site.instagramUrl} target="_blank" rel="noreferrer">
            @{site.instagramHandle}
          </a>
          .
        </p>
      </div>
    </section>
  )
}
