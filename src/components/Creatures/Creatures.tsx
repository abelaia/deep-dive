import type { CSSProperties } from 'react'
import { anim } from '../../constants/anim'
import { CREATURES } from '../../constants/art'
import { palette } from '../../constants/palette'
import { creatures } from '../../content'
import { mod } from '../../lib/bem'
import type { Creature, CreatureId } from '../../models'
import './Creatures.scss'

const placement = ({ x, y, size }: Creature): CSSProperties => ({ left: `${x}%`, top: `${y}%`, width: `${size}%` })

function Body({ creature }: { creature: Creature }) {
  const art = CREATURES[creature.id]
  const colors = palette.creatures[creature.id]
  return (
    <svg className="creatures__art creatures__art--body" viewBox={art.viewBox} style={placement(creature)} data-creature={creature.id}>
      <path d={art.body} fill={colors.body} stroke={colors.edge} strokeWidth="1.5" />
      {art.strokes.map((d) => (
        <path key={d} d={d} className="creatures__stroke" stroke={colors.edge} />
      ))}
      {art.eye && <circle {...art.eye} className="creatures__eye" />}
    </svg>
  )
}

function Glow({ creature, found }: { creature: Creature; found: boolean }) {
  const art = CREATURES[creature.id]
  return (
    <div className={mod('creatures__glow', { found })} style={placement(creature)}>
      <svg className="creatures__art" viewBox={art.viewBox}>
        {art.glows.map((glow) => (
          <circle key={`${glow.cx}-${glow.cy}`} {...glow} className="creatures__light" />
        ))}
      </svg>
      <p className="creatures__label">
        <span className="creatures__name">{creature.name}</span>
        <span className="creatures__latin">{creature.latin}</span>
      </p>
    </div>
  )
}

export function Creatures({ found }: { found: CreatureId[] }) {
  return (
    <>
      <div className="creatures creatures--bodies" aria-hidden="true" {...anim('creatures')}>
        {creatures.map((creature) => (
          <Body key={creature.id} creature={creature} />
        ))}
      </div>
      <div className="creatures creatures--glows" aria-hidden="true" {...anim('glows')}>
        {creatures.map((creature) => (
          <Glow key={creature.id} creature={creature} found={found.includes(creature.id)} />
        ))}
      </div>
    </>
  )
}
