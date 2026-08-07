import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type FC,
} from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface ProgressSliderContextType {
  active: string
  handleButtonClick: (value: string) => void
  vertical: boolean
  registerBar: (value: string, el: HTMLSpanElement | null) => void
}

interface ProgressSliderProps {
  children: ReactNode
  duration?: number
  fastDuration?: number
  vertical?: boolean
  activeSlider: string
  className?: string
}

interface SliderContentProps {
  children: ReactNode
  className?: string
}

interface SliderWrapperProps {
  children: ReactNode
  value: string
  className?: string
}

interface ProgressBarProps {
  children: ReactNode
  className?: string
}

interface SliderBtnProps {
  children: ReactNode
  value: string
  className?: string
  progressBarClass?: string
}

const ProgressSliderContext = createContext<
  ProgressSliderContextType | undefined
>(undefined)

export const useProgressSliderContext = (): ProgressSliderContextType => {
  const context = useContext(ProgressSliderContext)
  if (!context) {
    throw new Error(
      'useProgressSliderContext must be used within a ProgressSlider',
    )
  }
  return context
}

export const ProgressSlider: FC<ProgressSliderProps> = ({
  children,
  duration = 5000,
  fastDuration = 400,
  vertical = false,
  activeSlider,
  className,
}) => {
  const [active, setActive] = useState(activeSlider)
  const [sliderValues, setSliderValues] = useState<string[]>([])

  const activeRef = useRef(active)
  const durationRef = useRef(duration)
  const fastDurationRef = useRef(fastDuration)
  const verticalRef = useRef(vertical)
  const progressRef = useRef(0)
  const frameRef = useRef(0)
  const firstFrameTime = useRef(performance.now())
  const modeRef = useRef<'normal' | 'fast'>('normal')
  const fastStartRef = useRef(0)
  const targetValue = useRef<string | null>(null)
  const sliderValuesRef = useRef<string[]>([])
  const barsRef = useRef(new Map<string, HTMLSpanElement>())

  activeRef.current = active
  durationRef.current = duration
  fastDurationRef.current = fastDuration
  verticalRef.current = vertical
  sliderValuesRef.current = sliderValues

  const paintBars = useCallback((progress: number, activeValue: string) => {
    const prop = verticalRef.current ? 'height' : 'width'
    barsRef.current.forEach((el, value) => {
      el.style[prop] = value === activeValue ? `${progress}%` : '0%'
    })
  }, [])

  const registerBar = useCallback(
    (value: string, el: HTMLSpanElement | null) => {
      if (!el) {
        barsRef.current.delete(value)
        return
      }
      barsRef.current.set(value, el)
      const prop = verticalRef.current ? 'height' : 'width'
      el.style[prop] =
        value === activeRef.current ? `${progressRef.current}%` : '0%'
    },
    [],
  )

  useEffect(() => {
    const getChildren = React.Children.toArray(children).find(
      (child) => (child as React.ReactElement).type === SliderContent,
    ) as React.ReactElement<{ children?: ReactNode }> | undefined

    if (!getChildren) return
    const values = React.Children.toArray(getChildren.props.children).map(
      (child) => (child as React.ReactElement<{ value: string }>).props.value,
    )
    setSliderValues(values)
  }, [children])

  useEffect(() => {
    if (sliderValues.length === 0) return

    let alive = true
    modeRef.current = 'normal'
    progressRef.current = 0
    firstFrameTime.current = performance.now()
    paintBars(0, activeRef.current)

    const tick = (now: number) => {
      if (!alive) return

      const activeValue = activeRef.current
      const isFast = modeRef.current === 'fast'
      const currentDuration = isFast
        ? fastDurationRef.current
        : durationRef.current
      const timeFraction = (now - firstFrameTime.current) / currentDuration

      if (timeFraction < 1) {
        progressRef.current = isFast
          ? fastStartRef.current +
            (100 - fastStartRef.current) * timeFraction
          : timeFraction * 100
        paintBars(progressRef.current, activeValue)
        frameRef.current = requestAnimationFrame(tick)
        return
      }

      if (isFast && targetValue.current) {
        const next = targetValue.current
        targetValue.current = null
        modeRef.current = 'normal'
        progressRef.current = 0
        setActive(next)
        return
      }

      const values = sliderValuesRef.current
      const currentIndex = values.indexOf(activeValue)
      const nextIndex = (currentIndex + 1) % values.length
      progressRef.current = 0
      setActive(values[nextIndex])
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(frameRef.current)
    }
  }, [sliderValues, active, paintBars])

  const handleButtonClick = useCallback(
    (value: string) => {
      if (value === activeRef.current || modeRef.current === 'fast') return

      const elapsed = performance.now() - firstFrameTime.current
      fastStartRef.current = Math.min(
        100,
        (elapsed / durationRef.current) * 100,
      )
      progressRef.current = fastStartRef.current
      targetValue.current = value
      modeRef.current = 'fast'
      firstFrameTime.current = performance.now()
      paintBars(fastStartRef.current, activeRef.current)
    },
    [paintBars],
  )

  const contextValue = useMemo(
    () => ({
      active,
      handleButtonClick,
      vertical,
      registerBar,
    }),
    [active, handleButtonClick, vertical, registerBar],
  )

  return (
    <ProgressSliderContext.Provider value={contextValue}>
      <div className={cn('relative', className)}>{children}</div>
    </ProgressSliderContext.Provider>
  )
}

export const SliderContent: FC<SliderContentProps> = ({
  children,
  className,
}) => <div className={cn('', className)}>{children}</div>

export const SliderWrapper: FC<SliderWrapperProps> = ({
  children,
  value,
  className,
}) => {
  const { active } = useProgressSliderContext()

  return (
    <AnimatePresence mode="popLayout">
      {active === value && (
        <motion.div
          key={value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={cn('', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const SliderBtnGroup: FC<ProgressBarProps> = ({
  children,
  className,
}) => <div className={cn('', className)}>{children}</div>

export const SliderBtn: FC<SliderBtnProps> = ({
  children,
  value,
  className,
  progressBarClass,
}) => {
  const { active, handleButtonClick, registerBar } = useProgressSliderContext()

  return (
    <button
      type="button"
      className={cn(
        `relative ${active === value ? 'opacity-100' : 'opacity-50'}`,
        className,
      )}
      onClick={() => handleButtonClick(value)}
    >
      {children}
      <div
        className="absolute inset-0 -z-10 max-h-full max-w-full overflow-hidden"
        role="progressbar"
        aria-valuenow={active === value ? 100 : 0}
      >
        <span
          ref={(el) => registerBar(value, el)}
          className={cn('absolute left-0 top-0 h-full w-0', progressBarClass)}
        />
      </div>
    </button>
  )
}
