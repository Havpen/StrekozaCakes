import { useEffect, useState } from 'react'
import { site } from '../content/site'

export function StickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return

    const update = () => {
      const { bottom } = hero.getBoundingClientRect()
      setVisible(bottom <= 0)
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
    <div
      className={`sticky-cta${visible ? ' sticky-cta--visible' : ''}`}
      aria-hidden={!visible}
    >
      <a
        className="btn btn--primary"
        href={site.directUrl}
        target="_blank"
        rel="noreferrer"
        tabIndex={visible ? undefined : -1}
      >
        Написать в Direct
      </a>
    </div>
  )
}
