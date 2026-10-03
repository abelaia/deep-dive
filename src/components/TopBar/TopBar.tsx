import { anim } from '../../constants/anim'
import { creatures, ui } from '../../content'
import { useMissionClock } from '../../hooks/useMissionClock'
import { mod } from '../../lib/bem'
import { SoundToggle } from '../SoundToggle/SoundToggle'
import './TopBar.scss'

interface Props {
  running: boolean
  found: number
  sound: boolean
  onToggleSound: () => void
}

export function TopBar({ running, found, sound, onToggleSound }: Props) {
  const clock = useMissionClock(running)
  return (
    <header className="top-bar" {...anim('intro')}>
      <span className="top-bar__brand">{ui.brand}</span>
      <span className="top-bar__rec">
        <i className="top-bar__led" />
        {ui.rec} · {clock}
      </span>
      <span className={mod('top-bar__found', { complete: found === creatures.length })}>
        {ui.found} {found}/{creatures.length}
      </span>
      <SoundToggle enabled={sound} onToggle={onToggleSound} />
    </header>
  )
}
