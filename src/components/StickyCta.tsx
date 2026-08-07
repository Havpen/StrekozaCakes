import { site } from '../content/site'

export function StickyCta() {
  return (
    <div className="sticky-cta">
      <a
        className="btn btn--primary"
        href={site.directUrl}
        target="_blank"
        rel="noreferrer"
      >
        Написать в Direct
      </a>
    </div>
  )
}
