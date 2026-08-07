import { useEffect, useRef, useState } from 'react'
import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'

export function Header() {
  const [solid, setSolid] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const title = document.getElementById('hero-title')
    if (!title) return

    const update = () => {
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 64
      const titleTop = title.getBoundingClientRect().top
      setSolid(titleTop <= headerBottom)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <header ref={headerRef} className={`header${solid ? ' header--solid' : ''}`}>
      <div className="header__inner">
        <a className="brand" href="#top" aria-label={site.brand}>
          <Dragonfly className="brand__mark" tone={solid ? 'dark' : 'light'} />
          <span className="brand__name">{site.brand}</span>
        </a>

        <nav className="nav" aria-label="Навигация">
          <a href="#catalog">Каталог</a>
          <a href="#fillings">Начинки</a>
          <a href="#order">Как заказать</a>
          <a href="#gallery">Работы</a>
          <a href="#conditions">Условия</a>
          <a href="#reviews">Отзывы</a>
        </nav>

        <a
          className="btn btn--ink header__cta"
          href={site.directUrl}
          target="_blank"
          rel="noreferrer"
        >
          Direct
        </a>
      </div>
    </header>
  )
}
