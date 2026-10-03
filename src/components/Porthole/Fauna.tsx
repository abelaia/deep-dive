import type { CSSProperties } from 'react'
import { anim } from '../../constants/anim'
import { FAUNA } from '../../constants/art'
import { fauna, zones } from '../../content'
import { mod } from '../../lib/bem'
import type { FaunaMember } from '../../models'
import './Fauna.scss'

const groups = zones
  .map(({ id }) => ({ zone: id, members: fauna.filter((member) => member.zone === id) }))
  .filter(({ members }) => members.length)

function Swimmer({ member }: { member: FaunaMember }) {
  const art = FAUNA[member.art]
  const flip = member.direction !== 'up' && art.facing !== 'up' && art.facing !== member.direction
  const style = {
    '--lane': `${member.y}%`,
    '--size': `${member.size}%`,
    '--color': member.color,
    animationDuration: `${member.duration}s`,
    animationDelay: `${member.delay}s`,
  } as CSSProperties
  return (
    <div className={mod('fauna__swimmer', { [member.direction]: true })} style={style}>
      <svg className={mod('fauna__art', { flip })} viewBox={art.viewBox}>
        {art.parts.map(({ d, kind }) => (
          <path key={d} d={d} className={`fauna__${kind}`} />
        ))}
      </svg>
    </div>
  )
}

export function Fauna() {
  return (
    <div className="fauna" aria-hidden="true">
      {groups.map(({ zone, members }) => (
        <div key={zone} className="fauna__group" data-zone={zone} {...anim('fauna')}>
          {members.map((member, i) => (
            <Swimmer key={`${member.art}-${i}`} member={member} />
          ))}
        </div>
      ))}
    </div>
  )
}
