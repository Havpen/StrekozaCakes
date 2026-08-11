import { FAQ_ITEMS } from '../config/siteSeo'
import FAQ1 from '@/components/ui/faq-monocrhome'

const FAQ_META = [
  'Сроки',
  'Оплата',
  'Доставка',
  'Ассортимент',
  'Заказ',
  'Декор',
  'Цены',
] as const

export function Faq() {
  const items = FAQ_ITEMS.map((item, index) => ({
    ...item,
    meta: FAQ_META[index],
  }))

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="shell">
        <FAQ1
          items={items}
          title="Частые вопросы"
          description="Сроки, предоплата, доставка и то, как проходит заказ в Direct."
        />
      </div>
    </section>
  )
}
