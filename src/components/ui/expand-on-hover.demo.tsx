import { Skiper52 } from '@/components/ui/expand-on-hover'
import { asset } from '@/lib/asset'

/** Локальный превью карусели событий (не подключён в App). */
export default function DemoOne() {
  return (
    <Skiper52
      images={[
        {
          src: asset('images/events/mothers-day-tea.webp'),
          alt: 'Чайная пара',
          title: 'Чайная пара',
          description: 'Ко дню матери',
          price: 'от 60 BYN',
        },
      ]}
    />
  )
}
