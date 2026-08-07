type DragonflyProps = {
  className?: string
  tone?: 'dark' | 'light' | 'brand'
}

const strokeByTone = {
  dark: 'currentColor',
  light: '#f7f4ef',
  brand: '#1a1a1a',
} as const

export function Dragonfly({ className, tone = 'dark' }: DragonflyProps) {
  const stroke = strokeByTone[tone]

  return (
    <svg
      className={className}
      viewBox="0 0 80 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M40 8c0 0-1.4 4.2-1.4 7.4c0 1.9.6 3.3 1.4 3.3s1.4-1.4 1.4-3.3C41.4 12.2 40 8 40 8Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M40 18.5c-5.8-4-13.6-6-18.2-2.8c-2.9 2.1-2.3 6.5 1.5 9 4.5 2.9 11.4 2.2 16.7-1.1"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 18.5c5.8-4 13.6-6 18.2-2.8c2.9 2.1 2.3 6.5-1.5 9-4.5 2.9-11.4 2.2-16.7-1.1"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 22.5c-6.8-1.9-14.5-.3-17.9 4c-2.3 2.9-1 7.3 3.1 8.5 4.9 1.5 11.9-1 14.8-5.1"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 22.5c6.8-1.9 14.5-.3 17.9 4c2.3 2.9 1 7.3-3.1 8.5-4.9 1.5-11.9-1-14.8-5.1"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 18.5V48"
        stroke="#9E0000"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
