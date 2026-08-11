import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type HoverExpandImage = {
  src: string
  alt: string
  title: string
  description?: string
  price: string
}

type GalleryProps = {
  images: HoverExpandImage[]
  className?: string
}

/** Десктоп: прежняя expand-on-hover галерея */
function HoverExpandGallery({ images, className }: GalleryProps) {
  const [activeImage, setActiveImage] = useState<number | null>(0)

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className={cn('events-hover-gallery', className)}
    >
      <div className="flex w-full items-center justify-center gap-1.5">
        {images.map((image, index) => (
          <motion.div
            key={`hover-${image.src}-${index}`}
            className="relative cursor-pointer overflow-hidden rounded-3xl"
            initial={{ width: '2.5rem', height: '18rem' }}
            animate={{
              width: activeImage === index ? '22rem' : '4.25rem',
              height: '22rem',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={() => setActiveImage(index)}
            onHoverStart={() => setActiveImage(index)}
          >
            <AnimatePresence>
              {activeImage === index ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                />
              ) : null}
            </AnimatePresence>
            <AnimatePresence>
              {activeImage === index ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[2] flex h-full w-full flex-col items-start justify-end gap-1 p-4 text-left"
                >
                  <p className="text-base font-semibold leading-snug text-white">
                    {image.title}
                  </p>
                  {image.description ? (
                    <p className="text-sm leading-snug text-white/75">
                      {image.description}
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm font-medium tracking-wide text-white/90">
                    {image.price}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <img
              src={image.src}
              className="size-full object-cover"
              alt={image.alt}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/** Мобилка / планшет: горизонтальная карусель со стрелками */
function EventsArrowCarousel({ images, className }: GalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, next))
    setIndex(clamped)
    const track = trackRef.current
    const card = track?.children[clamped] as HTMLElement | undefined
    card?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }

  return (
    <div className={cn('events-carousel', className)}>
      <button
        type="button"
        className="events-carousel__nav events-carousel__nav--prev"
        aria-label="Предыдущее событие"
        onClick={() => goTo(index - 1)}
        disabled={index <= 0}
      >
        ‹
      </button>

      <div className="events-carousel__track" ref={trackRef}>
        {images.map((image, i) => (
          <article
            key={`slide-${image.src}-${i}`}
            className={`events-carousel__card${i === index ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          >
            <div className="events-carousel__media">
              <img
                src={image.src}
                alt={image.alt}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <div className="events-carousel__caption">
                <p className="events-carousel__title">{image.title}</p>
                {image.description ? (
                  <p className="events-carousel__desc">{image.description}</p>
                ) : null}
                <p className="events-carousel__price">{image.price}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="events-carousel__nav events-carousel__nav--next"
        aria-label="Следующее событие"
        onClick={() => goTo(index + 1)}
        disabled={index >= images.length - 1}
      >
        ›
      </button>
    </div>
  )
}

const Skiper52 = ({
  images,
  className,
}: {
  images: HoverExpandImage[]
  className?: string
}) => {
  return (
    <div className={cn('flex w-full flex-col items-center', className)}>
      <EventsArrowCarousel images={images} />
      <HoverExpandGallery images={images} />
    </div>
  )
}

export { Skiper52, HoverExpandGallery as HoverExpand_001 }
