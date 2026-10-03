import { anim } from '../../constants/anim'
import { WAVES } from '../../constants/art'
import './Surface.scss'

export function Surface() {
  return (
    <div className="surface" aria-hidden="true" {...anim('surface')}>
      <div className="surface__sky">
        <i className="surface__sun" />
      </div>
      <div className="surface__waves">
        {WAVES.layers.map(({ d, color, duration }) => (
          <svg key={d} className="surface__wave" viewBox={WAVES.viewBox} preserveAspectRatio="none" style={{ animationDuration: `calc(var(--dur-waves) * ${duration})` }}>
            <path d={d} fill={color} />
          </svg>
        ))}
      </div>
    </div>
  )
}
