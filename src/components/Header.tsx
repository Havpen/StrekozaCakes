import { useEffect, useId, useRef, useState } from 'react'
import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'
import { scrollToSection } from '../lib/scroll'

const navItems = [
  { id: 'catalog', label: 'Каталог' },
  { id: 'fillings', label: 'Начинки' },
  { id: 'order', label: 'Как заказать' },
  { id: 'gallery', label: 'Работы' },
  { id: 'events', label: 'События' },
  { id: 'conditions', label: 'Условия' },
  { id: 'reviews', label: 'Отзывы' },
] as const

export function Header() {
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuId = useId()

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

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 820px)').matches) setMenuOpen(false)
    }

    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  const goTo = (id: string, event: { preventDefault(): void }) => {
    setMenuOpen(false)
    scrollToSection(id, event)
  }

  return (
    <header
      ref={headerRef}
      className={`header${solid ? ' header--solid' : ''}${menuOpen ? ' header--menu-open' : ''}`}
    >
      <div className="header__inner">
        <a
          className="brand"
          href={import.meta.env.BASE_URL}
          aria-label={site.brand}
          onClick={(event) => goTo('top', event)}
        >
          <Dragonfly className="brand__mark" tone={solid || menuOpen ? 'dark' : 'light'} />
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

        <button
          type="button"
          className="header__burger"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="header__burger-lines" aria-hidden="true" />
        </button>
      </div>

      <div
        id={menuId}
        className={`header__panel${menuOpen ? ' header__panel--open' : ''}`}
        hidden={!menuOpen}
      >
        <nav className="header__panel-nav" aria-label="Мобильная навигация">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={import.meta.env.BASE_URL}
              onClick={(event) => goTo(item.id, event)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {menuOpen ? (
        <button
          type="button"
          className="header__backdrop"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
    </header>
  )
}
