import { site } from '../content/site'

export function Conditions() {
  return (
    <section className="section" id="conditions">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title">Условия</h2>
          <p className="section__lead">
            Коротко о том, что стоит знать до заказа. Доставка и самовывоз —{' '}
            {site.city}.
          </p>
        </div>

        <div className="conditions">
          {site.conditions.map((item) => (
            <article className="condition" key={item.title}>
              <h3 className="condition__title">{item.title}</h3>
              <p className="condition__text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
