import { useEffect, useRef } from 'react'
import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'
import { asset } from '@/lib/asset'
import { scrollToSection } from '../lib/scroll'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.playbackRate = 0.55

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const tryPlay = () => {
      if (document.hidden || reduceMotion.matches) {
        video.pause()
        return
      }
      void video.play().catch(() => {
        /* autoplay may be blocked — poster stays visible */
      })
    }

    tryPlay()

    const onVisibility = () => tryPlay()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      video.pause()
    }
  }, [])

  return (
    <section className="hero" id="top" aria-label="Главный экран">
      <div className="hero__media">
        <video
          ref={videoRef}
          className="hero__video"
          src={asset('videos/hero.mp4')}
          poster={site.heroImage}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          aria-label="STREKOZA — крафтовые десерты"
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
          <a
            className="btn btn--ghost"
            href={import.meta.env.BASE_URL}
            onClick={(event) => scrollToSection('catalog', event)}
          >
            Каталог
          </a>
        </div>
      </div>
    </section>
  )
}
