import { FAQ_ITEMS } from '../config/siteSeo'

export function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title" id="faq-title">
            Частые вопросы
          </h2>
          <p className="section__lead">
            Сроки, предоплата, доставка и то, как проходит заказ в Direct.
          </p>
        </div>

        <div className="faq">
          {FAQ_ITEMS.map((item) => (
            <article className="faq__item" key={item.question}>
              <h3 className="faq__question">{item.question}</h3>
              <p className="faq__answer">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
