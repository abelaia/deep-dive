import { anim, type AnimKey } from '../../constants/anim'
import { ui } from '../../content'
import type { CreatureId } from '../../models'
import { Dial } from './Dial'
import { Radar } from './Radar'
import './Instruments.scss'

const { readouts, units } = ui

const rows: { key: AnimKey; label: string; unit: string }[] = [
  { key: 'depth', label: readouts.depth, unit: units.depth },
  { key: 'pressure', label: readouts.pressure, unit: units.pressure },
  { key: 'temperature', label: readouts.temperature, unit: units.celsius },
  { key: 'light', label: readouts.light, unit: units.percent },
]

export function Instruments({ found }: { found: CreatureId[] }) {
  return (
    <section className="instruments" {...anim('intro')}>
      <Dial />
      <dl className="instruments__readouts">
        {rows.map(({ key, label, unit }) => (
          <div key={key} className="instruments__row">
            <dt className="instruments__label">{label}</dt>
            <dd className="instruments__value">
              <span {...anim(key)}>0</span>
              <span className="instruments__unit">{unit}</span>
            </dd>
          </div>
        ))}
      </dl>
      <Radar found={found} />
    </section>
  )
}
