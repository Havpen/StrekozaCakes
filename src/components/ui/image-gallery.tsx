import React, { useMemo } from 'react'
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

/**
 * Раскладываем в самую короткую колонку (по относительной высоте 1/ratio),
 * чтобы на 2–3 колонках не оставалась дыра справа внизу.
 */
function packColumns(items: ImageGalleryItem[], columnCount: number) {
  const columns: ImageGalleryItem[][] = Array.from(
    { length: columnCount },
    () => [],
  )
  const heights = Array.from({ length: columnCount }, () => 0)
  const gap = 0.08

  for (const item of items) {
    let shortest = 0
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i
    }
    columns[shortest].push(item)
    heights[shortest] += 1 / item.ratio + gap
  }

  return columns
}

export function ImageGallery({ items, className }: ImageGalleryProps) {
  const desktopColumns = useMemo(() => packColumns(items, 3), [items])
  const mobileColumns = useMemo(() => packColumns(items, 2), [items])

  return (
    <div className={cn('relative w-full', className)}>
      {/* Mobile / tablet: 2 колонки, без дыр справа */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
        {mobileColumns.map((column, colIndex) => (
          <div key={`m-${colIndex}`} className="grid gap-3 content-start sm:gap-4">
            {column.map((item, index) => (
              <AnimatedImage
                key={`m-${item.src}`}
                item={item}
                priority={colIndex === 0 && index < 2}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: 3 колонки */}
      <div className="hidden gap-5 lg:grid lg:grid-cols-3">
        {desktopColumns.map((column, colIndex) => (
          <div key={`d-${colIndex}`} className="grid gap-5 content-start">
            {column.map((item, index) => (
              <AnimatedImage
                key={`d-${item.src}`}
                item={item}
                priority={colIndex < 2 && index === 0}
              />
            ))}
          </div>
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
  const nearViewport = useInView(ref, {
    once: true,
    amount: 0.01,
    margin: '220px 0px 180px 0px',
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [failed, setFailed] = React.useState(false)
  const [shouldLoad, setShouldLoad] = React.useState(Boolean(priority))

  React.useEffect(() => {
    if (priority || nearViewport) setShouldLoad(true)
  }, [priority, nearViewport])

  const revealed = !isLoading && !failed && (priority || nearViewport)

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
            'absolute inset-0 size-full object-cover',
            'transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
            revealed ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0',
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
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-3 pt-8 text-left',
            'bg-[linear-gradient(to_top,rgba(10,10,12,0.72)_0%,rgba(10,10,12,0.28)_55%,transparent_100%)]',
            'transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
            revealed ? 'opacity-100' : 'opacity-0',
          )}
        >
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
