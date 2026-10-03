import { ui } from '../../content'
import { SoundToggle } from '../SoundToggle/SoundToggle'
import './Header.scss'

interface Props {
  sound: boolean
  onToggleSound: () => void
}

export function Header({ sound, onToggleSound }: Props) {
  return (
    <header className="header">
      <span className="header__brand">{ui.brand}</span>
      <SoundToggle enabled={sound} onToggle={onToggleSound} />
    </header>
  )
}
