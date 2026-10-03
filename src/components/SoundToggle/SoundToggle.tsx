import { ui } from '../../content'
import { mod } from '../../lib/bem'
import './SoundToggle.scss'

const BARS = 4
const BAR_PHASE = 0.27

interface Props {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <button
      type="button"
      className={mod('sound-toggle', { on: enabled })}
      aria-pressed={enabled}
      aria-label={enabled ? ui.sound.on : ui.sound.off}
      onClick={onToggle}
    >
      {Array.from({ length: BARS }, (_, i) => (
        <i key={i} className="sound-toggle__bar" style={{ animationDelay: `${-i * BAR_PHASE}s` }} />
      ))}
    </button>
  )
}
