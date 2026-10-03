import type { ReactNode } from 'react'
import { ui, zones } from '../../content'
import { mod } from '../../lib/bem'
import './Caption.scss'

export function Caption({ active, aside }: { active: number; aside?: ReactNode }) {
  const zone = zones[active]
  const hero = active === 0
  return (
    <section key={zone.id} className={mod('caption', { hero })}>
      <p className="caption__kicker">{zone.kicker}</p>
      <h1 className="caption__title">{zone.title}</h1>
      <p className="caption__text">{zone.text}</p>
      {aside && <div className="caption__aside">{aside}</div>}
      {hero && (
        <p className="caption__hint">
          <span>{ui.hint}</span>
          <i className="caption__line" />
        </p>
      )}
    </section>
  )
}
