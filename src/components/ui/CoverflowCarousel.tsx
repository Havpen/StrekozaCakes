import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import './coverflow-carousel.css'

export type CoverflowSlide = {
  src: string
  alt: string
  title?: string
  subtitle?: string
  /** Цвет «взрыва» рядом с названием начинки */
  accent?: string
}

export type CoverflowCarouselHandle = {
  goTo: (index: number) => void
}

type CoverflowCarouselProps = {
  slides: CoverflowSlide[]
  initialIndex?: number
  rotate?: number
  depth?: number
  perspective?: number
  falloff?: number
  fade?: number
  cardWidth?: string
  gap?: number
  loop?: boolean
  showCaption?: boolean
  showPagination?: boolean
  showNavigation?: boolean
  revealSides?: boolean
  label?: string
  className?: string
  onIndexChange?: (index: number) => void
  /** Same opacity curve as the product title caption (0–1). */
  onCaptionOpacity?: (opacity: number) => void
}

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const CoverflowCarousel = forwardRef<
  CoverflowCarouselHandle,
  CoverflowCarouselProps
>(function CoverflowCarousel(
  {
    slides,
    initialIndex = 0,
    rotate = 44,
    depth = 0.6,
    perspective = 3,
    falloff = 0.56,
    fade = 0.1,
    cardWidth = 'clamp(148px, 22vw, 260px)',
    gap = 0.05,
    loop = true,
    showCaption = false,
    showPagination = false,
    showNavigation = false,
    revealSides = false,
    label = 'Карусель',
    className,
    onIndexChange,
    onCaptionOpacity,
  },
  ref,
) {
  const count = slides.length
  const startIndex =
    count > 0 ? ((Math.round(initialIndex) % count) + count) % count : 0

  const frameRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const captionRef = useRef<HTMLDivElement>(null)
  const captionTitleRef = useRef<HTMLParagraphElement>(null)
  const captionTitleTextRef = useRef<HTMLSpanElement>(null)
  const captionBurstRef = useRef<SVGSVGElement>(null)
  const captionSubRef = useRef<HTMLParagraphElement>(null)
  const captionIndexRef = useRef(startIndex)
  const posRef = useRef(startIndex)
  const targetRef = useRef(startIndex)
  const widthRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const sideRevealRef = useRef(revealSides ? 0 : 1)
  const dragRef = useRef<{
    id: number
    x: number
    pos: number
    v: number
    t: number
    moved: boolean
  } | null>(null)

  const [selected, setSelected] = useState(startIndex)
  const selectedRef = useRef(selected)
  selectedRef.current = selected

  const onIndexChangeRef = useRef(onIndexChange)
  onIndexChangeRef.current = onIndexChange
  const onCaptionOpacityRef = useRef(onCaptionOpacity)
  onCaptionOpacityRef.current = onCaptionOpacity
  const slidesRef = useRef(slides)
  slidesRef.current = slides

  const writeCaption = useCallback((index: number) => {
    const slide = slidesRef.current[index]
    const title = slide?.title ?? ''
    const accent = slide?.accent

    if (captionTitleTextRef.current) {
      captionTitleTextRef.current.textContent = title
    }
    if (captionBurstRef.current) {
      const show = Boolean(accent && title)
      captionBurstRef.current.style.display = show ? '' : 'none'
      if (show && accent) {
        captionBurstRef.current
          .querySelectorAll('[data-burst-stroke]')
          .forEach((node) => {
            node.setAttribute('stroke', accent)
          })
      }
    }
    if (captionTitleRef.current) {
      captionTitleRef.current.style.display = title ? '' : 'none'
    }
    if (captionSubRef.current) {
      const sub = slide?.subtitle ?? ''
      captionSubRef.current.textContent = sub
      captionSubRef.current.style.display = sub ? '' : 'none'
    }
  }, [])

  const indexAt = useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  )

  const paint = useCallback(() => {
    if (!count) return
    const width = widthRef.current
    const pitch = width * (1 + gap)
    const pos = posRef.current
    const sideReveal = sideRevealRef.current

    if (width) {
      cardRefs.current.forEach((card, index) => {
        if (!card) return

        let offset = index - pos
        if (loop) {
          offset = ((offset % count) + count) % count
          if (offset > count / 2) offset -= count
        }

        const distance = Math.abs(offset)
        const isCenter = distance < 0.001

        const stagger = isCenter
          ? 0
          : Math.min(0.62, Math.max(0, distance - 0.2) * 0.22)
        const span = Math.max(0.001, 1 - stagger)
        const raw = isCenter ? 1 : (sideReveal - stagger) / span
        const local = Math.max(0, Math.min(1, raw))
        const eased = local * local * (3 - 2 * local)

        const ramp = Math.pow(distance, falloff)
        const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset) * eased
        const spread = isCenter ? 1 : 0.22 + 0.78 * eased
        const zPush = isCenter ? 1 : 0.35 + 0.65 * eased

        card.style.transform =
          `translateX(calc(-50% + ${offset * pitch * spread}px)) ` +
          `translateZ(${-depth * width * ramp * zPush}px) rotateY(${-tilt}deg)`

        const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1
        const base = Math.max(0, 1 - fade * distance) * edge
        card.style.opacity = String(isCenter ? 1 : base * eased)
        card.style.zIndex = String(100 - Math.round(distance))
      })
    }

    const nearest = indexAt(pos)
    const dist = Math.abs(pos - Math.round(pos))
    const centered = Math.max(0, 1 - dist * 2.2)
    const centeredEase = centered * centered * (3 - 2 * centered)
    const enterGate = revealSides
      ? Math.max(0, Math.min(1, (sideReveal - 0.08) / 0.55))
      : 1
    const enterEase = enterGate * enterGate * (3 - 2 * enterGate)
    const captionOpacity = centeredEase * enterEase

    if (showCaption && captionRef.current) {
      captionRef.current.style.opacity = String(captionOpacity)

      // Swap copy only while caption is nearly invisible (mid-transition),
      // so the new title fades in with the arriving card — not halfway through.
      if (nearest !== captionIndexRef.current && centered < 0.16) {
        captionIndexRef.current = nearest
        writeCaption(nearest)
        setSelected(nearest)
        onIndexChangeRef.current?.(nearest)
      }
    } else if (nearest !== captionIndexRef.current && centered < 0.16) {
      captionIndexRef.current = nearest
      setSelected(nearest)
      onIndexChangeRef.current?.(nearest)
    }

    onCaptionOpacityRef.current?.(captionOpacity)
  }, [
    count,
    depth,
    fade,
    falloff,
    gap,
    indexAt,
    loop,
    revealSides,
    rotate,
    showCaption,
    writeCaption,
  ])

  const settle = useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      targetRef.current = target
      const next = indexAt(target)

      const from = posRef.current
      const delta = target - from

      const commit = () => {
        setSelected(next)
        if (next !== captionIndexRef.current) {
          captionIndexRef.current = next
          writeCaption(next)
        }
        onIndexChangeRef.current?.(next)
      }

      if (Math.abs(delta) < 0.0004) {
        posRef.current = target
        commit()
        paint()
        return
      }

      const distance = Math.abs(delta)
      const duration = Math.min(1100, Math.max(720, 520 + distance * 280))
      const started = performance.now()

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / duration)
        posRef.current = from + delta * easeInOutCubic(t)
        paint()
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step)
          return
        }
        posRef.current = target
        commit()
        paint()
        rafRef.current = null
      }

      rafRef.current = requestAnimationFrame(step)
    },
    [indexAt, paint, writeCaption],
  )

  const clamp = useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  )

  const goTo = useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index
      settle(clamp(target))
    },
    [clamp, count, loop, settle],
  )

  useImperativeHandle(ref, () => ({ goTo }), [goTo])

  const nudge = useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  )

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    targetRef.current = posRef.current

    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      moved: false,
    }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    const pitch = widthRef.current * (1 + gap)
    if (!pitch) return

    if (Math.abs(event.clientX - drag.x) > 6) {
      drag.moved = true
    }

    const now = performance.now()
    const previous = posRef.current
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch)
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000
    drag.t = now

    const index = indexAt(posRef.current)
    if (index !== selected) {
      setSelected(index)
    }
    paint()
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    dragRef.current = null

    if (drag.moved) {
      const carried = Math.max(-1.35, Math.min(1.35, drag.v * 0.12))
      settle(clamp(Math.round(posRef.current + carried)))
      return
    }

    settle(clamp(Math.round(posRef.current)))
  }

  const onSideSlidePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (index === selectedRef.current) return
    // Side cards select on press — don't start a drag on the frame.
    event.stopPropagation()
    goTo(index)
  }

  useIsoLayoutEffect(() => {
    posRef.current = startIndex
    targetRef.current = startIndex
    captionIndexRef.current = startIndex
    setSelected(startIndex)
    writeCaption(startIndex)
  }, [startIndex, writeCaption])

  useIsoLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const card = cardRefs.current[startIndex] ?? cardRefs.current[0]
      if (!card) return
      widthRef.current = card.offsetWidth
      paint()
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [paint, startIndex])

  useEffect(() => {
    if (!revealSides) {
      sideRevealRef.current = 1
      paint()
      return
    }

    sideRevealRef.current = 0
    paint()

    let raf = 0
    const delayMs = 140
    const duration = 1200
    const started = performance.now() + delayMs

    const step = (now: number) => {
      if (now < started) {
        raf = requestAnimationFrame(step)
        return
      }
      const t = Math.min(1, (now - started) / duration)
      sideRevealRef.current = 1 - (1 - t) ** 4
      paint()
      if (t < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // Only run the entrance fan-out once per mount / revealSides toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealSides])

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    },
    [],
  )

  if (!count) return null

  return (
    <div
      className={['cf-root', className].filter(Boolean).join(' ')}
      style={{ ['--cf-card' as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="cf-stage">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              nudge(-1)
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              nudge(1)
            }
          }}
          className="cf-frame"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: 'pan-y',
          }}
        >
          <div className="cf-track">
            {slides.map((slide, index) => (
              <div
                key={`${slide.src}-${index}`}
                ref={(node) => {
                  cardRefs.current[index] = node
                }}
                data-slide-index={index}
                role="button"
                tabIndex={0}
                aria-roledescription="slide"
                aria-label={`${index + 1} из ${count}`}
                className={`cf-slide${index === selected ? ' cf-slide--center' : ' cf-slide--side'}`}
                onPointerDown={(event) => onSideSlidePointerDown(event, index)}
                onClick={(event) => {
                  if (index === selectedRef.current) return
                  event.stopPropagation()
                  goTo(index)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    if (index !== selectedRef.current) goTo(index)
                  }
                }}
              >
                <img src={slide.src} alt={slide.alt} draggable={false} />
                {!showCaption && (slide.title || slide.subtitle) ? (
                  <div className="cf-slide-copy">
                    {slide.title ? (
                      <p className="cf-slide-title">{slide.title}</p>
                    ) : null}
                    {slide.subtitle ? (
                      <p className="cf-slide-sub">{slide.subtitle}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {showNavigation ? (
          <>
            <button
              type="button"
              aria-label="Предыдущий"
              onClick={() => nudge(-1)}
              className="cf-nav cf-nav--prev"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Следующий"
              onClick={() => nudge(1)}
              className="cf-nav cf-nav--next"
            >
              ›
            </button>
          </>
        ) : null}

        {showCaption ? (
          <div ref={captionRef} className="cf-caption" style={{ opacity: 0 }}>
            <p ref={captionTitleRef} className="cf-caption-title">
              <svg
                ref={captionBurstRef}
                className="cf-caption-burst"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
                style={{ display: 'none' }}
              >
                <g
                  data-burst-stroke
                  stroke="#9E0000"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="2" x2="12" y2="6.2" />
                  <line x1="12" y1="17.8" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6.2" y2="12" />
                  <line x1="17.8" y1="12" x2="22" y2="12" />
                  <line x1="4.9" y1="4.9" x2="7.9" y2="7.9" />
                  <line x1="16.1" y1="16.1" x2="19.1" y2="19.1" />
                  <line x1="19.1" y1="4.9" x2="16.1" y2="7.9" />
                  <line x1="7.9" y1="16.1" x2="4.9" y2="19.1" />
                </g>
              </svg>
              <span ref={captionTitleTextRef} />
            </p>
            <p
              ref={captionSubRef}
              className="cf-caption-sub"
              style={{ display: 'none' }}
            />
          </div>
        ) : null}
      </div>

      {showPagination ? (
        <div className="cf-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Слайд ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={`cf-dot${index === selected ? ' cf-dot--active' : ''}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
})
