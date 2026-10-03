import { readout } from '../../hooks/useDive'
import { SCROLL_VH, ui, zoneOffsets, zones } from '../../content'
import { mod } from '../../lib/bem'
import { scrollToY } from '../../lib/smoothScroll'
import './Hud.scss'

const goTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) scrollToY(el.offsetTop)
}

export function Hud({ active }: { active: number }) {
  const { units } = ui
  return (
    <>
      <div className="hud__reading" aria-live="off">
        <p className="hud__depth">
          <span {...readout('depth')}>0</span>
          <span className="hud__unit">{units.depth}</span>
        </p>
        <p className="hud__meta">
          <span {...readout('pressure')}>1</span> {units.pressure} · <span {...readout('temperature')}>26</span> {units.celsius}
        </p>
      </div>
      <nav className="hud__rail" aria-label={ui.nav}>
        <i className="hud__fill" />
        {zones.map(({ id, nav }, i) => (
          <button
            key={id}
            type="button"
            className={mod('hud__tick', { active: i === active, passed: i < active })}
            style={{ top: `${(zoneOffsets[id] / SCROLL_VH) * 100}%` }}
            onClick={() => goTo(id)}
          >
            <span className="hud__label">{nav}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
