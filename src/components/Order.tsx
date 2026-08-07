import { useEffect, useRef } from 'react'
import { site } from '../content/site'
import { asset } from '@/lib/asset'

export function Order() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visibleEnough = false
    let wasPlaying = false

    const syncPlayback = () => {
      const shouldPlay =
        visibleEnough &&
        !document.hidden &&
        !reduceMotion.matches

      if (shouldPlay) {
        if (!wasPlaying) {
          video.currentTime = 0
          wasPlaying = true
        }
        void video.play().catch(() => {})
        return
      }

      if (wasPlaying) {
        video.pause()
        video.currentTime = 0
        wasPlaying = false
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        // Играем только когда большая часть кадра реально на экране
        visibleEnough =
          entry.isIntersecting && entry.intersectionRatio >= 0.55
        syncPlayback()
      },
      {
        threshold: [0, 0.25, 0.55, 0.75, 1],
        rootMargin: '0px',
      },
    )

    const onVisibility = () => syncPlayback()
    document.addEventListener('visibilitychange', onVisibility)

    io.observe(video)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      video.pause()
    }
  }, [])

  return (
    <section className="section order-band" id="order">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title">Как заказать</h2>
          <p className="section__lead">
            Без корзины и форм — заказы по Гомелю через Instagram Direct.
          </p>
        </div>

        <ol className="steps">
          {site.orderSteps.map((step, index) => (
            <li className="step" key={step.title}>
              <span className="step__index">0{index + 1}</span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="order-video">
          <video
            ref={videoRef}
            className="order-video__media"
            src={asset('videos/how-to-order.mp4')}
            muted
            playsInline
            loop
            preload="metadata"
            controls={false}
            aria-label="Как оформить заказ в Instagram Direct"
          />
        </div>
      </div>
    </section>
  )
}
