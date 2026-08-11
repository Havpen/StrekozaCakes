import { site } from '../content/site'
import { asset } from '@/lib/asset'
import { Skiper52, type HoverExpandImage } from '@/components/ui/expand-on-hover'

const eventItems: HoverExpandImage[] = [
  {
    src: asset('images/events/mothers-day-tea.webp'),
    alt: 'Чайная пара ко Дню матери',
    title: 'Чайная пара',
    description: 'Ко дню матери',
    price: 'от 60 BYN',
  },
  {
    src: asset('images/events/march8-bento.webp'),
    alt: 'Муссовый бенто к 8 марта',
    title: 'Бенто — муссовый',
    description: 'Ивент к 8 марта',
    price: 'от 65 BYN',
  },
  {
    src: asset('images/events/easter-kulich.webp'),
    alt: 'Куличи к Пасхе',
    title: 'Куличи к Пасхе',
    description: 'Праздничная линейка',
    price: '35–60 BYN',
  },
  {
    src: asset('images/events/knowledge-day-cake.webp'),
    alt: 'Cake to go и букетик ко Дню знаний',
    title: 'Cake to go & букетик',
    description: 'Идеальный вариант для дня знаний',
    price: 'от 60 BYN',
  },
  {
    src: asset('images/events/cake-pops.webp'),
    alt: 'Cake pops для девичника',
    title: 'Cake pops',
    description: 'Скрасит любой девичник',
    price: 'от 6 BYN/шт',
  },
  {
    src: asset('images/events/easter-bunnies.webp'),
    alt: 'Муссовые зайчики к Пасхе',
    title: 'Муссовые зайчики к Пасхе',
    description: 'Клубника — шоколад · Персик — шоколад',
    price: 'от 12 BYN',
  },
]

export function Events() {
  return (
    <section className="section" id="events" aria-labelledby="events-title">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title" id="events-title">
            События в STREKOZA
          </h2>
          <p className="section__lead">
            Сезонные сеты и праздничные позиции — наведите на фото или листайте
            стрелками.
          </p>
        </div>

        <Skiper52 images={eventItems} />

        <p className="events__note">
          Подробнее в Instagram{' '}
          <a href={site.instagramUrl} target="_blank" rel="noreferrer">
            @{site.instagramHandle}
          </a>
        </p>
      </div>
    </section>
  )
}
