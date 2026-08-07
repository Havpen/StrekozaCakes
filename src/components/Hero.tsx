import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'

export function Hero() {
  return (
    <section className="hero" id="top" aria-label="Главный экран">
      <div className="hero__media">
        <img
          src={site.heroImage}
          alt="Муссовый торт STREKOZA"
          width={1800}
          height={1800}
          fetchPriority="high"
        />
        <div className="hero__veil" aria-hidden="true" />
      </div>

      <div className="hero__content">
        <div className="hero__brand-row" id="hero-title">
          <Dragonfly className="hero__dragonfly" tone="light" />
          <h1 className="hero__title">{site.brand}</h1>
        </div>

        <div className="hero__text">
          <p className="hero__tagline">{site.tagline}</p>
          <p className="hero__support">{site.heroSupport}</p>
        </div>

        <div className="hero__actions">
          <a
            className="btn btn--primary"
            href={site.directUrl}
            target="_blank"
            rel="noreferrer"
          >
            Написать в Direct
          </a>
          <a className="btn btn--ghost" href="#catalog">
            Каталог
          </a>
        </div>
      </div>
    </section>
  )
}
