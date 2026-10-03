import { anim } from '../../constants/anim'
import { creatures, ui } from '../../content'
import { mod } from '../../lib/bem'
import type { CreatureId } from '../../models'

export function Radar({ found }: { found: CreatureId[] }) {
  return (
    <figure className="radar" aria-label={ui.sonar}>
      <div className="radar__screen">
        <i className="radar__sweep" />
        <div className="radar__blips" {...anim('radar')}>
          {creatures.map(({ id, x, y }) => (
            <i key={id} className={mod('radar__blip', { found: found.includes(id) })} style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
        </div>
      </div>
      <figcaption className="radar__caption">{ui.sonar}</figcaption>
    </figure>
  )
}
