import {
  useEffect,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { site, type FillingItem } from '../content/site'
import { Burst } from './Burst'

function collectFillings(): FillingItem[] {
  const seen = new Set<string>()
  const items: FillingItem[] = []
  for (const group of site.fillings) {
    for (const item of group.items) {
      if (seen.has(item.name)) continue
      seen.add(item.name)
      items.push(item)
    }
  }
  return items
}

const SPEED = 0.035 // px per ms

export function FillingsMarquee() {
  const items = useMemo(() => collectFillings(), [])
  const rootRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)
  const pausedRef = useRef(false)
  const offscreenRef = useRef(false)
  const startLoopRef = useRef<() => void>(() => {})
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startOffset: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const root = rootRef.current
    if (!track || !root) return

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    let raf = 0
    let last = performance.now()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const wrap = () => {
      const half = halfWidthRef.current
      if (half <= 0) return
      while (offsetRef.current <= -half) offsetRef.current += half
      while (offsetRef.current > 0) offsetRef.current -= half
    }

    const tick = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now

      const moving =
        !offscreenRef.current &&
        !pausedRef.current &&
        !dragRef.current &&
        !reduceMotion.matches

      if (!moving) {
        raf = 0
        return
      }

      offsetRef.current -= SPEED * dt
      wrap()
      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (raf || offscreenRef.current || pausedRef.current || dragRef.current) {
        return
      }
      if (reduceMotion.matches) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    startLoopRef.current = startLoop

    const io = new IntersectionObserver(
      ([entry]) => {
        offscreenRef.current = !entry.isIntersecting
        if (entry.isIntersecting) startLoop()
      },
      { rootMargin: '80px' },
    )
    io.observe(root)

    startLoop()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      startLoopRef.current = () => {}
    }
  }, [])

  const onPointerEnter = () => {
    if (!dragRef.current) pausedRef.current = true
  }

  const onPointerLeave = () => {
    if (!dragRef.current) {
      pausedRef.current = false
      startLoopRef.current()
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return

    pausedRef.current = true
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      moved: false,
    }
    viewport.setPointerCapture(event.pointerId)
    viewport.classList.add('fillings-marquee__viewport--dragging')
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    if (Math.abs(dx) > 3) drag.moved = true

    offsetRef.current = drag.startOffset + dx
    const half = halfWidthRef.current
    if (half > 0) {
      while (offsetRef.current <= -half) offsetRef.current += half
      while (offsetRef.current > 0) offsetRef.current -= half
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
    }
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    const viewport = viewportRef.current
    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId)
    }
    viewport?.classList.remove('fillings-marquee__viewport--dragging')
    pausedRef.current = viewport?.matches(':hover') ?? false
    if (!pausedRef.current) startLoopRef.current()
  }

  return (
    <section
      ref={rootRef}
      className="fillings-marquee"
      id="fillings"
      aria-label="Начинки"
    >
      <div
        ref={viewportRef}
        className="fillings-marquee__viewport"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="fillings-marquee__track">
          <ul className="fillings-marquee__list">
            {items.map((item) => (
              <li key={item.name} className="fillings-marquee__item">
                <Burst color={item.color} className="fillings-marquee__burst" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          <ul className="fillings-marquee__list" aria-hidden="true">
            {items.map((item) => (
              <li key={`dup-${item.name}`} className="fillings-marquee__item">
                <Burst color={item.color} className="fillings-marquee__burst" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
