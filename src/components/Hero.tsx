import { useEffect, useRef } from 'react'
import { Dragonfly } from './Dragonfly'
import { site } from '../content/site'
import { HERO_SUPPORT, SITE_H1 } from '../config/siteSeo'
import { asset } from '@/lib/asset'
import { scrollToSection } from '../lib/scroll'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.playbackRate = 0.75

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
        <img
          className="hero__poster"
          src={site.heroImage}
          alt="STREKOZA — муссовый торт и десерты на заказ в Гомеле"
          width={1600}
          height={2000}
          fetchPriority="high"
          decoding="async"
        />
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
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="hero__veil" aria-hidden="true" />
      </div>

      <div className="hero__content">
        <div className="hero__brand-row" id="hero-title">
          <Dragonfly className="hero__dragonfly" tone="light" />
          <p className="hero__title">{site.brand}</p>
        </div>

        <div className="hero__text">
          <h1 className="hero__h1">{SITE_H1}</h1>
          <p className="hero__support">{HERO_SUPPORT}</p>
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
