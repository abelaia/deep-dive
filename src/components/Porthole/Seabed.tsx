import type { CSSProperties } from 'react'
import { anim } from '../../constants/anim'
import { SEABED } from '../../constants/art'
import './Seabed.scss'

const { cucumber } = SEABED

export function Seabed() {
  return (
    <div className="seabed" aria-hidden="true" {...anim('seabed')}>
      {SEABED.herd.map(({ x, size, duration, delay }) => (
        <svg
          key={x}
          className="seabed__cucumber"
          viewBox={cucumber.viewBox}
          style={{ '--start': `${x}%`, width: `${size}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s` } as CSSProperties}
        >
          <path className="seabed__cucumber-body" d={cucumber.body} />
          <path className="seabed__cucumber-legs" d={cucumber.legs} />
        </svg>
      ))}
      <svg className="seabed__ground" viewBox={SEABED.viewBox} preserveAspectRatio="none">
        <path className="seabed__far" d={SEABED.ground} />
        <path className="seabed__near" d={SEABED.ridge} />
        {SEABED.xenophyophores.map((blob) => (
          <circle key={blob.cx} className="seabed__blob" {...blob} />
        ))}
      </svg>
    </div>
  )
}
