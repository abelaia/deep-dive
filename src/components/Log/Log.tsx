import type { ReactNode } from 'react'
import { soundEngine } from '../../audio/SoundEngine'
import { anim } from '../../constants/anim'
import { ui, zones } from '../../content'
import { useTypewriter } from '../../hooks/useTypewriter'
import { mod } from '../../lib/bem'
import type { Zone, ZoneId } from '../../models'
import './Log.scss'

const pad = (n: number) => String(n).padStart(2, '0')
const typeSound = () => soundEngine.type()

interface Props {
  active: number
  live: boolean
  asides: Partial<Record<ZoneId, ReactNode>>
}

function Entry({ zone, live, aside }: { zone: Zone; live: boolean; aside?: ReactNode }) {
  const { typed, done } = useTypewriter(zone.text, live, typeSound)
  return (
    <article className="log__entry">
      <p className="log__stamp">{zone.kicker}</p>
      <h2 className="log__title">{zone.title}</h2>
      <p className="log__text">
        {typed}
        <i className={mod('log__cursor', { idle: done })} />
      </p>
      {aside && <div className={mod('log__aside', { visible: done })}>{aside}</div>}
    </article>
  )
}

export function Log({ active, live, asides }: Props) {
  const zone = zones[active]
  return (
    <section className="log" {...anim('intro')}>
      <header className="log__head">
        <span className="log__label">{ui.log}</span>
        <span className="log__index">
          {pad(active + 1)} / {pad(zones.length)}
        </span>
      </header>
      <ol className="log__history">
        {zones.slice(0, active).map(({ id, title }, i) => (
          <li key={id} className="log__past">
            <span className="log__past-index">{pad(i + 1)}</span>
            {title}
          </li>
        ))}
      </ol>
      <Entry key={zone.id} zone={zone} live={live} aside={asides[zone.id]} />
    </section>
  )
}
