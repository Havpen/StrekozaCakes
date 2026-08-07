type BurstProps = {
  color: string
  className?: string
}

export function Burst({ color, className }: BurstProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <g stroke={color} strokeWidth="1.6" strokeLinecap="round">
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
  )
}
