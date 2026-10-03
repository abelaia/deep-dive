import type { ReactNode } from 'react'
import { anim } from '../../constants/anim'
import './Cockpit.scss'

interface Props {
  bar: ReactNode
  log: ReactNode
  view: ReactNode
  instruments: ReactNode
  tape: ReactNode
}

export function Cockpit({ bar, log, view, instruments, tape }: Props) {
  return (
    <div className="cockpit" {...anim('cockpit')}>
      <div className="cockpit__bar">{bar}</div>
      <div className="cockpit__log">{log}</div>
      <div className="cockpit__view">
        <span className="cockpit__ghost" aria-hidden="true" {...anim('ghost')}>
          0
        </span>
        {view}
      </div>
      <div className="cockpit__instruments">{instruments}</div>
      <div className="cockpit__tape">{tape}</div>
    </div>
  )
}
