import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'
import { scrollToSection } from '../lib/scroll'

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div>
          <div className="footer__brand">
            <Dragonfly className="footer__mark" tone="light" />
            <span className="brand__name">{site.brand}</span>
          </div>
          <p className="footer__text">
            {site.tagline}. Доставка и самовывоз по {site.city}. Заказы и
            консультации — только в Instagram Direct.
          </p>
          <div className="footer__meta">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer">
              @{site.instagramHandle}
            </a>
            <span>Заказы · {site.city}</span>
            <span>Яндекс Доставка · самовывоз</span>
          </div>
        </div>

        <div className="footer__actions">
          <a
            className="btn btn--primary"
            href={site.directUrl}
            target="_blank"
            rel="noreferrer"
          >
            Написать в Direct
          </a>
          <a
            className="btn btn--ghost"
            href={import.meta.env.BASE_URL}
            onClick={(event) => scrollToSection('catalog', event)}
          >
            Смотреть каталог
          </a>
        </div>
      </div>
    </footer>
  )
}
