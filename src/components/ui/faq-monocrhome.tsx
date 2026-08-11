import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'

const FADE_STYLE_ID = 'faq1-animations'

export type FaqMonochromeItem = {
  question: string
  answer: string
  meta?: string
}

type FAQ1Props = {
  items: FaqMonochromeItem[]
  title?: string
  description?: string
  className?: string
}

const palette = {
  surface: 'bg-transparent text-[var(--color-ink)]',
  panel: 'bg-white/80',
  border: 'border-[var(--color-line)]',
  heading: 'text-[var(--color-ink)]',
  muted: 'text-[var(--color-muted)]',
  iconRing: 'border-[var(--color-line)]',
  iconSurface: 'bg-[var(--color-ink)]/5',
  icon: 'text-[var(--color-ink)]',
  glow: 'rgba(15, 15, 15, 0.08)',
  shadow: 'shadow-[0_24px_80px_-50px_rgba(15,15,15,0.22)]',
}

function FAQ1({
  items,
  title = 'Частые вопросы',
  description = 'Сроки, предоплата, доставка и то, как проходит заказ в Direct.',
  className = '',
}: FAQ1Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(FADE_STYLE_ID)) return

    const style = document.createElement('style')
    style.id = FADE_STYLE_ID
    style.innerHTML = `
      @keyframes faq1-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(6px); }
        60% { filter: blur(0); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      .faq1-fade {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
        filter: blur(12px);
        transition: opacity 700ms ease, transform 700ms ease, filter 700ms ease;
      }
      .faq1-fade--ready {
        animation: faq1-fade-up 860ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
      }
    `

    document.head.appendChild(style)

    return () => {
      if (style.parentNode) style.remove()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      setHasEntered(true)
      return
    }

    let timeout: number | undefined
    const onLoad = () => {
      timeout = window.setTimeout(() => setHasEntered(true), 120)
    }

    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', onLoad)
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [])

  const list = useMemo(() => items, [items])

  const toggleQuestion = (index: number) =>
    setActiveIndex((prev) => (prev === index ? -1 : index))

  const setCardGlow = (event: MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    target.style.setProperty('--faq-x', `${event.clientX - rect.left}px`)
    target.style.setProperty('--faq-y', `${event.clientY - rect.top}px`)
  }

  const clearCardGlow = (event: MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget
    target.style.removeProperty('--faq-x')
    target.style.removeProperty('--faq-y')
  }

  return (
    <div className={`relative w-full ${palette.surface} ${className}`}>
      <div
        className={`relative mx-auto flex max-w-4xl flex-col gap-10 px-0 py-2 lg:max-w-5xl ${
          hasEntered ? 'faq1-fade--ready' : 'faq1-fade'
        }`}
      >
        <header className="flex flex-col gap-4 text-center md:gap-5">
          <h2
            id="faq-title"
            className={`text-3xl font-semibold leading-tight md:text-4xl ${palette.heading}`}
          >
            {title}
          </h2>
          <p className={`mx-auto max-w-xl text-base ${palette.muted}`}>
            {description}
          </p>
        </header>

        <ul className="space-y-4">
          {list.map((item, index) => {
            const open = activeIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-trigger-${index}`
            const triggerStyle = {
              ['--faq-outline']: 'rgba(17,17,17,0.25)',
            } as CSSProperties

            return (
              <li
                key={item.question}
                className={`group relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 focus-within:-translate-y-0.5 ${palette.border} ${palette.panel} ${palette.shadow}`}
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    open
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{
                    background: `radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), ${palette.glow}, transparent 70%)`,
                  }}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => toggleQuestion(index)}
                  style={triggerStyle}
                  className="relative flex w-full items-start gap-4 px-5 py-6 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--faq-outline)] sm:gap-6 sm:px-8 sm:py-7"
                >
                  <span
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-105 sm:h-12 sm:w-12 ${palette.iconRing} ${palette.iconSurface}`}
                  >
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-full border opacity-30 ${
                        palette.iconRing
                      } ${open ? 'animate-ping' : ''}`}
                    />
                    <svg
                      className={`relative h-5 w-5 transition-transform duration-500 ${palette.icon} ${open ? 'rotate-45' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 5v14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <h3
                        className={`text-base font-medium leading-tight sm:text-xl ${palette.heading}`}
                      >
                        {item.question}
                      </h3>
                      {item.meta ? (
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.35em] transition-opacity duration-300 sm:ml-auto ${palette.border} ${palette.muted}`}
                        >
                          {item.meta}
                        </span>
                      ) : null}
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden text-sm leading-relaxed transition-[max-height] duration-500 ease-out ${
                        open ? 'max-h-[32rem]' : 'max-h-0'
                      } ${palette.muted}`}
                    >
                      <p className="pr-2 pb-1">{item.answer}</p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default FAQ1
export { FAQ1 }
