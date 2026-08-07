import { useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import { asset } from '@/lib/asset'

export function Order() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showPlay, setShowPlay] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visibleEnough = false
    let sourceAttached = false

    const ensureSource = () => {
      if (sourceAttached) return
      sourceAttached = true
      video.src = asset('videos/how-to-order.mp4')
      video.load()
    }

    const tryPlay = async () => {
      if (!visibleEnough || document.hidden || reduceMotion.matches) {
        video.pause()
        return
      }

      ensureSource()
      try {
        video.currentTime = 0
      } catch {
        /* ignore seek before metadata */
      }

      try {
        await video.play()
        setShowPlay(false)
      } catch {
        setShowPlay(true)
      }
    }

    const onPause = () => {
      if (!visibleEnough) setShowPlay(true)
    }
    const onPlaying = () => setShowPlay(false)

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleEnough =
          entry.isIntersecting && entry.intersectionRatio >= 0.35
        if (!visibleEnough) {
          video.pause()
          try {
            video.currentTime = 0
          } catch {
            /* ignore */
          }
          setShowPlay(true)
          return
        }
        void tryPlay()
      },
      {
        threshold: [0, 0.2, 0.35, 0.6, 1],
      },
    )

    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    document.addEventListener('visibilitychange', () => {
      void tryPlay()
    })
    io.observe(video)

    return () => {
      io.disconnect()
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.pause()
    }
  }, [])

  const handlePlayTap = async () => {
    const video = videoRef.current
    if (!video) return
    if (!video.getAttribute('src')) {
      video.src = asset('videos/how-to-order.mp4')
      video.load()
    }
    try {
      await video.play()
      setShowPlay(false)
    } catch {
      setShowPlay(true)
    }
  }

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
            muted
            playsInline
            loop
            preload="none"
            controls={false}
            aria-label="Как оформить заказ в Instagram Direct"
          />
          {showPlay ? (
            <button
              type="button"
              className="order-video__play"
              onClick={() => void handlePlayTap()}
              aria-label="Смотреть видео"
            >
              <span>Смотреть</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
