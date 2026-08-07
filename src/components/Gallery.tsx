import { site } from '../content/site'
import { asset } from '@/lib/asset'
import {
  ImageGallery,
  type ImageGalleryItem,
} from '@/components/ui/image-gallery'

/**
 * Разные пропорции специально вразнобой:
 * высокие / широкие / почти квадрат — чтобы masonry не складывался рядами.
 * href — прямая ссылка на пост Instagram с этим заказом.
 */
const galleryItems: ImageGalleryItem[] = [
  {
    src: asset('images/gallery/img_1253.webp'),
    alt: 'Муссовый бенто-торт — клубника',
    title: 'Муссовый бенто-торт',
    desc: 'Клубника',
    ratio: 3 / 4,
    href: 'https://www.instagram.com/p/DPlSKTljIN3/?img_index=1',
  },
  {
    src: asset('images/gallery/img_0362.webp'),
    alt: 'Трайфл — орео и сгущенка',
    title: 'Трайфл',
    desc: 'Орео и сгущенка',
    ratio: 16 / 10,
    href: site.instagramUrl,
  },
  {
    src: asset('images/gallery/img_0574.webp'),
    alt: 'Муссовый торт — вишня + шоколад',
    title: 'Муссовый торт',
    desc: 'Вишня + шоколад',
    ratio: 4 / 5,
    href: 'https://www.instagram.com/p/DPMY5b3CA4T/?img_index=1',
  },
  {
    src: asset('images/gallery/order-04-pastry-peach-lemon.webp'),
    alt: 'Муссовые пирожные — персик / лимон',
    title: 'Муссовые пирожные',
    desc: 'Персик / лимон',
    ratio: 1,
    href: 'https://www.instagram.com/p/DVVr2q6jUYK/?img_index=1',
  },
  {
    src: asset('images/gallery/img_6881.webp'),
    alt: 'Муссовый бенто-торт — вишня-шоколад',
    title: 'Муссовый бенто-торт',
    desc: 'Вишня-шоколад',
    ratio: 5 / 6,
    href: 'https://www.instagram.com/p/DP1mPcgDKsb/?img_index=1',
  },
  {
    src: asset('images/gallery/img_1109.webp'),
    alt: 'Муссовые пирожные — малина / персик / лимон',
    title: 'Муссовые пирожные',
    desc: 'Малина / персик / лимон',
    ratio: 16 / 11,
    href: 'https://www.instagram.com/p/DaKZnw7ADxz/?img_index=1',
  },
  {
    src: asset('images/gallery/img_1124.webp'),
    alt: 'Моти — клубника',
    title: 'Моти',
    desc: 'Клубника',
    ratio: 4 / 5,
    href: 'https://www.instagram.com/p/DaKZhC2gK7v/?img_index=1',
  },
  {
    src: asset('images/gallery/order-08-cake-mixed.webp'),
    alt: 'Муссовый торт — шоколад / персик / клубника',
    title: 'Муссовый торт',
    desc: 'Шоколад / персик / клубника',
    ratio: 5 / 4,
    objectPosition: 'center 32%',
    href: 'https://www.instagram.com/p/DVPCco8gMny/?img_index=1',
  },
  {
    src: asset('images/gallery/img_1486.webp'),
    alt: 'Муссовый бенто-торт — вишня-шоколад',
    title: 'Муссовый бенто-торт',
    desc: 'Вишня-шоколад',
    ratio: 3 / 4,
    objectPosition: 'center 72%',
    href: 'https://www.instagram.com/p/DVohOwujQEL/?img_index=1',
  },
  {
    src: asset('images/gallery/img_7196.webp'),
    alt: 'Муссовый торт — клубника',
    title: 'Муссовый торт',
    desc: 'Клубника',
    ratio: 16 / 10,
    objectPosition: 'center 78%',
    href: 'https://www.instagram.com/p/DV6kXRnAFRR/',
  },
  {
    src: asset('images/gallery/img_2443.webp'),
    alt: 'Трайфл — праздничный декор',
    title: 'Трайфл',
    desc: 'Праздничный декор',
    ratio: 5 / 6,
    href: 'https://www.instagram.com/p/DbibIVxANPP/?img_index=1',
  },
  {
    src: asset('images/gallery/img_9964.webp'),
    alt: 'Корпусные пирожные — персик',
    title: 'Корпусные пирожные',
    desc: 'Персик',
    ratio: 6 / 5,
    href: 'https://www.instagram.com/p/DYwZpZngHeU/?img_index=1',
  },
]

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
