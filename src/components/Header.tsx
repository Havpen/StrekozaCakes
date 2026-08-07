import { useEffect, useRef, useState } from 'react'
import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'
import { scrollToSection } from '../lib/scroll'

const navItems = [
  { id: 'catalog', label: 'Каталог' },
  { id: 'fillings', label: 'Начинки' },
  { id: 'order', label: 'Как заказать' },
  { id: 'gallery', label: 'Работы' },
  { id: 'conditions', label: 'Условия' },
  { id: 'reviews', label: 'Отзывы' },
] as const

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
        <a
          className="brand"
          href={import.meta.env.BASE_URL}
          aria-label={site.brand}
          onClick={(event) => scrollToSection('top', event)}
        >
          <Dragonfly className="brand__mark" tone={solid ? 'dark' : 'light'} />
          <span className="brand__name">{site.brand}</span>
        </a>

        <nav className="nav" aria-label="Навигация">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={import.meta.env.BASE_URL}
              onClick={(event) => scrollToSection(item.id, event)}
            >
              {item.label}
            </a>
          ))}
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
