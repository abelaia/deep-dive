import { anim } from '../../constants/anim'
import { DIAL } from '../../constants/config'
import { ocean, ui } from '../../content'

const kmMax = ocean.maxDepth / 1000
const angleFor = (km: number) => ((km / kmMax - 0.5) * DIAL.sweep * Math.PI) / 180
const point = (angle: number, radius: number) => [Math.sin(angle) * radius, -Math.cos(angle) * radius]

const ticks = Array.from({ length: Math.floor(kmMax / DIAL.majorKm) * DIAL.minorPerMajor + 1 }, (_, i) => {
  const km = (i * DIAL.majorKm) / DIAL.minorPerMajor
  const major = i % DIAL.minorPerMajor === 0
  const angle = angleFor(km)
  const [x1, y1] = point(angle, 44)
  const [x2, y2] = point(angle, major ? 36 : 40)
  const [lx, ly] = point(angle, 28)
  return { km, major, line: { x1, y1, x2, y2 }, label: major && km % DIAL.labelEvery === 0 ? { x: lx, y: ly } : null }
})

export function Dial() {
  return (
    <svg className="dial" viewBox="-50 -50 100 100" aria-hidden="true" {...anim('needle')}>
      <circle className="dial__face" r="48" />
      {ticks.map(({ km, major, line, label }) => (
        <g key={km}>
          <line className={major ? 'dial__tick dial__tick--major' : 'dial__tick'} {...line} />
          {label && (
            <text className="dial__number" x={label.x} y={label.y}>
              {km}
            </text>
          )}
        </g>
      ))}
      <text className="dial__unit" y="18">
        {ui.dial}
      </text>
      <g className="dial__needle">
        <line y1="8" y2="-40" />
        <circle r="3.5" />
      </g>
    </svg>
  )
}
