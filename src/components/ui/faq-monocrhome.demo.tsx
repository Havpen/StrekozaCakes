import FAQ1 from '@/components/ui/faq-monocrhome'
import { FAQ_ITEMS } from '@/config/siteSeo'

/** Локальный превью-демо компонента FAQ (не подключён в App). */
export default function DemoOne() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-paper)]">
      <FAQ1
        items={FAQ_ITEMS.map((item) => ({ ...item }))}
        title="Частые вопросы"
        description="Сроки, предоплата, доставка и то, как проходит заказ в Direct."
      />
    </div>
  )
}
