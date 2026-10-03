import type { CSSProperties } from 'react'
import { anim } from '../../constants/anim'
import { CRACK } from '../../constants/config'
import { CRACKS, JELLY, RIVETS, WHALE } from '../../constants/art'
import { ui } from '../../content'
import type { CreatureId } from '../../models'
import { Creatures } from '../Creatures/Creatures'
import { Fauna } from './Fauna'
import { FishSchool } from './FishSchool'
import { Particles } from './Particles'
import { Seabed } from './Seabed'
import { Surface } from './Surface'
import './Porthole.scss'

const [cx, cy] = CRACK.origin

export function Porthole({ found }: { found: CreatureId[] }) {
  return (
    <div className="porthole" {...anim('intro')}>
      <div className="porthole__window" {...anim('window')}>
        <Surface />
        <div className="porthole__rays" {...anim('rays')} />
        <div className="porthole__caustics" {...anim('caustics')} />
        <FishSchool />
        <svg className="porthole__whale" viewBox={WHALE.viewBox} aria-hidden="true" {...anim('whale')}>
          <path d={WHALE.body} />
        </svg>
        <div className="porthole__jellies" aria-hidden="true" {...anim('jellies')}>
          {JELLY.swarm.map(({ x, y, size, delay }) => (
            <svg
              key={`${x}-${y}`}
              className="porthole__jelly"
              viewBox={JELLY.viewBox}
              style={{ left: `${x}%`, top: `${y}%`, width: `${size}%`, animationDelay: `${delay}s` }}
            >
              <path className="porthole__jelly-bell" d={JELLY.bell} />
              {JELLY.tentacles.map((d) => (
                <path key={d} className="porthole__jelly-tentacle" d={d} />
              ))}
            </svg>
          ))}
        </div>
        <Fauna />
        <Seabed />
        <Particles />
        <div className="porthole__beam" {...anim('beam')} />
        <Creatures found={found} />
        <svg className="porthole__cracks" viewBox={CRACKS.viewBox} aria-hidden="true">
          {CRACKS.paths.map((d) => (
            <path key={d} d={d} pathLength={100} {...anim('cracks')} />
          ))}
          {CRACKS.rings.map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} pathLength={100} {...anim('cracks')} />
          ))}
        </svg>
        <div className="porthole__glass" />
      </div>
      <div className="porthole__rim" style={{ '--rivets': RIVETS } as CSSProperties}>
        {Array.from({ length: RIVETS }, (_, i) => (
          <i key={i} className="porthole__rivet" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
      <p className="porthole__alarm" {...anim('alarm')}>
        {ui.alarm}
      </p>
    </div>
  )
}
