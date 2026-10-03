import type { CSSProperties } from 'react'
import { anim } from '../../constants/anim'
import { TAPE } from '../../constants/config'
import { ocean, ui, zones } from '../../content'
import { mod } from '../../lib/bem'
import { scrollToY } from '../../lib/smoothScroll'
import './DepthTape.scss'

const fmtNumber = new Intl.NumberFormat('ru-RU')
const marks = Array.from({ length: Math.floor(ocean.maxDepth / TAPE.minor) + 1 }, (_, i) => i * TAPE.minor)
const at = (depth: number) => ({ '--at': depth }) as CSSProperties

const goTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) scrollToY(el.offsetTop)
}

export function DepthTape({ active }: { active: number }) {
  return (
    <nav className="depth-tape" aria-label={ui.nav} style={{ '--scale': TAPE.pxPerMeter } as CSSProperties} {...anim('tape')}>
      <div className="depth-tape__strip">
        {marks.map((depth) => {
          const major = depth % TAPE.major === 0
          return (
            <span key={depth} className={mod('depth-tape__mark', { major })} style={at(depth)}>
              {major && fmtNumber.format(depth)}
            </span>
          )
        })}
        {zones.slice(1).map(({ id, nav, from }, i) => (
          <button key={id} type="button" className={mod('depth-tape__zone', { active: i + 1 === active })} style={at(from)} onClick={() => goTo(id)}>
            {nav}
          </button>
        ))}
      </div>
      <i className="depth-tape__pointer" />
    </nav>
  )
}
