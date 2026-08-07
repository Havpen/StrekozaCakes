import React from 'react'
import { useInView } from 'motion/react'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export type ImageGalleryItem = {
  src: string
  alt: string
  title?: string
  desc?: string
  ratio: number
  objectPosition?: string
  href?: string
}

type ImageGalleryProps = {
  items: ImageGalleryItem[]
  className?: string
}

export function ImageGallery({ items, className }: ImageGalleryProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="gallery-masonry-grid">
        {items.map((item, index) => (
          <AnimatedImage
            key={item.src + item.alt}
            item={item}
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  )
}

function AnimatedImage({
  item,
  priority,
}: {
  item: ImageGalleryItem
  priority?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [isLoading, setIsLoading] = React.useState(true)
  const [failed, setFailed] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(Boolean(priority))

  React.useEffect(() => {
    if (priority || isInView) setShouldLoad(true)
  }, [priority, isInView])

  const media = (
    <AspectRatio
      ratio={item.ratio}
      className="relative size-full overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-blue-wash)]"
    >
      {shouldLoad && !failed ? (
        <img
          alt={item.alt}
          src={item.src}
          className={cn(
            'size-full rounded-lg object-cover transition-opacity duration-500 ease-out',
            isLoading ? 'opacity-0' : 'opacity-100',
          )}
          style={
            item.objectPosition
              ? { objectPosition: item.objectPosition }
              : undefined
          }
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setFailed(true)
            setIsLoading(false)
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      ) : null}
      {item.title ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-10 text-left">
          <p className="text-sm font-semibold text-white">{item.title}</p>
          {item.desc ? (
            <p className="mt-0.5 text-xs text-white/80">{item.desc}</p>
          ) : null}
        </div>
      ) : null}
    </AspectRatio>
  )

  if (item.href) {
    return (
      <div ref={ref} className="gallery-masonry-item">
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={
            item.title
              ? `${item.title}. ${item.desc ?? ''}. Открыть Instagram`
              : item.alt
          }
          className="block overflow-hidden rounded-lg"
        >
          {media}
        </a>
      </div>
    )
  }

  return (
    <div ref={ref} className="gallery-masonry-item">
      {media}
    </div>
  )
}
