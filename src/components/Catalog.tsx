import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { site } from '../content/site'
import { FillingsList } from './Fillings'
import {
  CoverflowCarousel,
  type CoverflowCarouselHandle,
  type CoverflowSlide,
} from './ui/CoverflowCarousel'

type Phase = 'idle' | 'fly' | 'carousel'

const CAROUSEL_CARD = 'min(62vmin, 400px)'
/** Must match `--catalog-carousel-y` in CSS — vertical center of the coverflow card. */
const CAROUSEL_Y = 0.46

function resolveCardSizePx() {
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:absolute;visibility:hidden;width:min(62vmin, 400px);pointer-events:none;'
  document.body.appendChild(probe)
  const size = probe.getBoundingClientRect().width
  document.body.removeChild(probe)
  return Math.max(size, 160)
}

export function Catalog() {
  const cards = site.catalog
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const flyerRef = useRef<HTMLDivElement>(null)
  const detailsCopyRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [sliceIndex, setSliceIndex] = useState(0)
  const [flyerStyle, setFlyerStyle] = useState<CSSProperties | null>(null)
  const [directHint, setDirectHint] = useState<string | null>(null)
  const [fullCatalogOpen, setFullCatalogOpen] = useState(false)
  const [listDirectHint, setListDirectHint] = useState<string | null>(null)

  const activeCard = activeIndex !== null ? cards[activeIndex] : null

  const activeFillingsGroup = useMemo(() => {
    if (!activeCard?.fillingsKey) return null
    return site.fillings.find((g) => g.id === activeCard.fillingsKey) ?? null
  }, [activeCard])

  const slides: CoverflowSlide[] = useMemo(() => {
    if (!activeCard) return []

    const accentByName = new Map(
      (activeFillingsGroup?.items ?? []).map((item) => [item.name, item.color]),
    )

    const sliceSlides = activeCard.slices.map((slice) => ({
      src: slice.src,
      alt: slice.alt ?? `${activeCard.name} — ${slice.filling}`,
      title: slice.filling,
      subtitle: `${activeCard.name} · от ${activeCard.priceFrom} BYN${activeCard.priceUnit ?? ''}`,
      accent: accentByName.get(slice.filling),
    }))

    // Обложка с полным списком начинок, дальше — фото с подписью начинки
    // (без дубля обложки, если первый разрез совпадает с ней)
    if (activeCard.fillingsKey) {
      return [
        {
          src: activeCard.cover,
          alt: activeCard.name,
          title: activeCard.name,
          subtitle: `от ${activeCard.priceFrom} BYN${activeCard.priceUnit ?? ''}`,
        },
        ...sliceSlides.filter((slide) => slide.src !== activeCard.cover),
      ]
    }

    return sliceSlides
  }, [activeCard, activeFillingsGroup])

  const hasCoverSlide = Boolean(activeCard?.fillingsKey)
  const isCoverSlide = Boolean(hasCoverSlide && sliceIndex === 0)

  const viewedSlice = (() => {
    if (!activeCard || !hasCoverSlide || sliceIndex === 0) return null
    const title = slides[sliceIndex]?.title
    if (!title) return null
    return activeCard.slices.find((slice) => slice.filling === title) ?? null
  })()

  const coverflowRef = useRef<CoverflowCarouselHandle>(null)

  const handleSliceChange = useCallback((index: number) => {
    setSliceIndex(index)
  }, [])

  const handleFillingSelect = useCallback(
    (name: string) => {
      const index = slides.findIndex(
        (slide, i) => i > 0 && slide.title === name,
      )
      if (index >= 0) {
        coverflowRef.current?.goTo(index)
        return
      }
      // Начинка показана на обложке — остаёмся / возвращаемся на неё
      const slice = activeCard?.slices.find((item) => item.filling === name)
      if (slice && activeCard && slice.src === activeCard.cover) {
        coverflowRef.current?.goTo(0)
      }
    },
    [slides, activeCard],
  )

  const handleCaptionOpacity = useCallback((opacity: number) => {
    if (detailsCopyRef.current) {
      detailsCopyRef.current.style.opacity = String(opacity)
    }
  }, [])

  const orderDraft = useMemo(() => {
    if (!activeCard) return null
    return {
      name: activeCard.name,
      detail: activeCard.detail,
      priceFrom: activeCard.priceFrom,
      priceUnit: activeCard.priceUnit,
      filling: viewedSlice?.filling ?? null,
    }
  }, [activeCard, viewedSlice])

  const orderDirectUrl = useMemo(() => {
    if (!orderDraft) return site.directUrl
    return site.directOrderUrl(orderDraft)
  }, [orderDraft])

  const openOrderDirect = useCallback(
    async (event: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!orderDraft) return
      event.preventDefault()

      const message = site.buildOrderMessage(orderDraft)
      const url = site.directOrderUrl(orderDraft)

      // Тихий бэкап в буфер — на случай, если Instagram срежет ?text=
      void navigator.clipboard?.writeText(message).catch(() => undefined)

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        window.location.assign(url)
        return
      }

      window.open(url, '_blank', 'noopener,noreferrer')
      setDirectHint('Готово — вставьте текст в чат (Ctrl+V)')
      window.setTimeout(() => setDirectHint(null), 4500)
    },
    [orderDraft],
  )

  const openListDirect = useCallback(
    async (
      event: ReactMouseEvent<HTMLAnchorElement>,
      card: (typeof cards)[number],
    ) => {
      event.preventDefault()
      const draft = {
        name: card.name,
        detail: card.detail,
        priceFrom: card.priceFrom,
        priceUnit: card.priceUnit,
        filling: null as string | null,
      }
      const message = site.buildOrderMessage(draft)
      const url = site.directOrderUrl(draft)

      void navigator.clipboard?.writeText(message).catch(() => undefined)

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      if (isMobile) {
        window.location.assign(url)
        return
      }

      window.open(url, '_blank', 'noopener,noreferrer')
      setListDirectHint(card.id)
      window.setTimeout(() => setListDirectHint(null), 4500)
    },
    [cards],
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => {
    setPhase('idle')
    setActiveIndex(null)
    setSliceIndex(0)
    setFlyerStyle(null)
  }, [])

  const openCard = useCallback(
    (index: number) => {
      const origin = cardRefs.current.get(cards[index].id)
      if (!origin) return

      const from = origin.getBoundingClientRect()
      const size = resolveCardSizePx()
      const toLeft = (window.innerWidth - size) / 2
      const toTop = window.innerHeight * CAROUSEL_Y - size / 2

      setActiveIndex(index)
      setSliceIndex(0)
      setPhase('fly')
      setFlyerStyle({
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        borderRadius: 12,
        transition: 'none',
      })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyerStyle({
            left: toLeft,
            top: toTop,
            width: size,
            height: size,
            borderRadius: 18,
            transition:
              'left 0.65s cubic-bezier(0.22, 1, 0.36, 1), top 0.65s cubic-bezier(0.22, 1, 0.36, 1), width 0.65s cubic-bezier(0.22, 1, 0.36, 1), height 0.65s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
          })
        })
      })
    },
    [cards],
  )

  useEffect(() => {
    if (phase !== 'fly') return

    const flyer = flyerRef.current
    if (!flyer) return

    const onDone = (event: TransitionEvent) => {
      if (event.propertyName !== 'width') return
      setPhase('carousel')
    }

    flyer.addEventListener('transitionend', onDone)
    const timer = window.setTimeout(() => setPhase('carousel'), 750)

    return () => {
      flyer.removeEventListener('transitionend', onDone)
      window.clearTimeout(timer)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'idle') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [phase, close])

  const overlay =
    mounted &&
    activeCard &&
    phase !== 'idle' &&
    createPortal(
      <div
        className="catalog-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={activeCard.name}
      >
        <button type="button" className="catalog-overlay__back" onClick={close}>
          ← Назад
        </button>

        <button
          type="button"
          className="catalog-overlay__dismiss"
          aria-label="Закрыть"
          onClick={close}
        />

        {phase === 'fly' && flyerStyle ? (
          <div
            ref={flyerRef}
            className="catalog-flyer"
            style={flyerStyle}
            aria-hidden
          >
            <span
              className="catalog-flyer__media"
              style={{ backgroundImage: `url(${activeCard.cover})` }}
            />
          </div>
        ) : null}

        {phase === 'carousel' && slides.length > 0 ? (
          <div className="catalog-overlay__stage">
            <CoverflowCarousel
              ref={coverflowRef}
              key={activeCard.id}
              slides={slides}
              initialIndex={0}
              revealSides
              showCaption
              showNavigation={slides.length > 1}
              label={`Начинки — ${activeCard.name}`}
              cardWidth={CAROUSEL_CARD}
              className="catalog-overlay__coverflow"
              onIndexChange={handleSliceChange}
              onCaptionOpacity={handleCaptionOpacity}
            />

            <div className="catalog-overlay__details">
              <div
                ref={detailsCopyRef}
                className="catalog-overlay__copy"
                style={{ opacity: 0 }}
              >
                <p className="catalog-overlay__desc">{activeCard.description}</p>
                {isCoverSlide && activeFillingsGroup ? (
                  <div className="catalog-overlay__fillings">
                    <p className="catalog-overlay__fillings-label">
                      Возможные начинки
                    </p>
                    <FillingsList
                      group={activeFillingsGroup}
                      compact
                      onSelect={handleFillingSelect}
                    />
                  </div>
                ) : viewedSlice ? (
                  <p className="catalog-overlay__slice">
                    Начинка на фото:{' '}
                    <span>{viewedSlice.filling}</span>
                  </p>
                ) : null}
              </div>
              <div className="catalog-overlay__actions">
                <p className="catalog-overlay__direct-tip">
                  Текст заказа уже скопирован — просто вставьте его в Direct
                </p>
                <a
                  className="btn btn--primary catalog-overlay__cta"
                  href={orderDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={openOrderDirect}
                >
                  Обсудить в Direct
                </a>
                {directHint ? (
                  <p className="catalog-overlay__direct-hint" role="status">
                    {directHint}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>,
      document.body,
    )

  return (
    <section className="section catalog" id="catalog">
      <div className="shell">
        <div className="section__head">
          <h2 className="section__title">Каталог</h2>
          <p className="section__lead">
            Базовые позиции для заказов в Гомеле. Цены — «от», финальный вариант
            собираем вместе: декор, начинка и дата.
          </p>
        </div>

        <div
          className={`catalog-stage${phase !== 'idle' ? ' catalog-stage--expanded' : ''}`}
        >
          <div className="catalog-grid">
            {cards.map((card, index) => {
              const isActive = activeIndex === index
              const isDimmed = phase !== 'idle' && !isActive

              return (
                <button
                  key={card.id}
                  type="button"
                  ref={(node) => {
                    if (node) cardRefs.current.set(card.id, node)
                    else cardRefs.current.delete(card.id)
                  }}
                  className={[
                    'catalog-card',
                    isActive ? 'catalog-card--active' : '',
                    isDimmed ? 'catalog-card--dimmed' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    if (phase !== 'idle') return
                    openCard(index)
                  }}
                  aria-expanded={isActive}
                >
                  <span
                    className="catalog-card__media"
                    style={{ backgroundImage: `url(${card.cover})` }}
                    aria-hidden
                  />
                  <span className="catalog-card__shade" aria-hidden />
                  <span className="catalog-card__body">
                    <span className="catalog-card__name">{card.name}</span>
                    <span className="catalog-card__detail">{card.detail}</span>
                    <span className="catalog-card__price">
                      от {card.priceFrom} BYN{card.priceUnit ?? ''}
                    </span>
                    <span className="catalog-card__action">
                      Смотреть начинки
                      <span aria-hidden="true">›</span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="catalog-full">
          <button
            type="button"
            className="btn btn--ink catalog-full__toggle"
            aria-expanded={fullCatalogOpen}
            aria-controls="catalog-full-panel"
            onClick={() => setFullCatalogOpen((open) => !open)}
          >
            {fullCatalogOpen ? 'Скрыть каталог' : 'Полный каталог'}
            <span aria-hidden="true">{fullCatalogOpen ? '▴' : '▾'}</span>
          </button>

          <div
            id="catalog-full-panel"
            className={`catalog-full__panel${fullCatalogOpen ? ' is-open' : ''}`}
            aria-hidden={!fullCatalogOpen}
            inert={!fullCatalogOpen ? true : undefined}
          >
            <div className="catalog-full__inner">
              <ul className="catalog-list">
                {cards.map((card) => {
                  const directUrl = site.directOrderUrl({
                    name: card.name,
                    detail: card.detail,
                    priceFrom: card.priceFrom,
                    priceUnit: card.priceUnit,
                    filling: null,
                  })

                  return (
                    <li key={card.id} className="catalog-list__item">
                      <div
                        className="catalog-list__media"
                        style={{ backgroundImage: `url(${card.cover})` }}
                        role="img"
                        aria-label={card.name}
                      />
                      <div className="catalog-list__body">
                        <div className="catalog-list__head">
                          <h3 className="catalog-list__name">{card.name}</h3>
                          <p className="catalog-list__price">
                            от {card.priceFrom} BYN{card.priceUnit ?? ''}
                          </p>
                        </div>
                        <p className="catalog-list__detail">{card.detail}</p>
                        <p className="catalog-list__desc">{card.description}</p>
                        <div className="catalog-list__actions">
                          <a
                            className="btn btn--primary catalog-list__cta"
                            href={directUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => openListDirect(event, card)}
                          >
                            В Direct
                          </a>
                          {listDirectHint === card.id ? (
                            <p className="catalog-list__hint" role="status">
                              Текст скопирован — вставьте в чат (Ctrl+V)
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <p className="catalog__note">
          Откройте позицию — внутри карусель разрезов с разными начинками.
          Тематические новинки — в ленте Instagram @{site.instagramHandle}.
        </p>
      </div>

      {overlay}
    </section>
  )
}
