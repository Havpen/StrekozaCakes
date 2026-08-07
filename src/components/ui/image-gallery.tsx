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
  columns?: 2 | 3
}

function splitColumns(items: ImageGalleryItem[], columns: number) {
  const cols: ImageGalleryItem[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => {
    cols[index % columns].push(item)
  })
  return cols
}

export function ImageGallery({
  items,
  className,
  columns = 3,
}: ImageGalleryProps) {
  const cols = splitColumns(items, columns)

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'mx-auto grid w-full gap-4 sm:gap-5',
          columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {cols.map((column, colIndex) => (
          <div key={colIndex} className="grid gap-4 sm:gap-5 content-start">
            {column.map((item) => (
              <AnimatedImage key={item.src + item.alt} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedImage({ item }: { item: ImageGalleryItem }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const [isLoading, setIsLoading] = React.useState(true)

  const media = (
    <AspectRatio
      ratio={item.ratio}
      className="relative size-full overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-blue-wash)]"
    >
      <img
        alt={item.alt}
        src={item.src}
        className={cn(
          'size-full rounded-lg object-cover opacity-0 transition-all duration-1000 ease-in-out',
          {
            'opacity-100': isInView && !isLoading,
          },
        )}
        style={
          item.objectPosition
            ? { objectPosition: item.objectPosition }
            : undefined
        }
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
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
      <div ref={ref}>
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={
            item.title
              ? `${item.title}. ${item.desc ?? ''}. Открыть Instagram`
              : item.alt
          }
          className="block overflow-hidden rounded-lg transition-opacity hover:opacity-95"
        >
          {media}
        </a>
      </div>
    )
  }

  return <div ref={ref}>{media}</div>
}
