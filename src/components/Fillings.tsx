import { type FillingGroup } from '../content/site'
import { Burst } from './Burst'

type FillingsListProps = {
  group: FillingGroup
  compact?: boolean
  onSelect?: (name: string) => void
}

/** Compact list used in catalog overlay (e.g. mochi cover). */
export function FillingsList({
  group,
  compact = false,
  onSelect,
}: FillingsListProps) {
  return (
    <div className={`fillings${compact ? ' fillings--compact' : ''}`}>
      <ul className="fillings__list">
        {group.items.map((item) => (
          <li key={item.name} className="fillings__item">
            {onSelect ? (
              <button
                type="button"
                className="fillings__button"
                onClick={() => onSelect(item.name)}
              >
                <Burst color={item.color} className="fillings__burst" />
                <span>{item.name}</span>
              </button>
            ) : (
              <>
                <Burst color={item.color} className="fillings__burst" />
                <span>{item.name}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
