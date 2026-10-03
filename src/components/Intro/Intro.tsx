import { useEffect, useState } from 'react'
import { ui } from '../../content'
import { mod } from '../../lib/bem'
import { lockScroll } from '../../lib/smoothScroll'
import './Intro.scss'

export function Intro({ onEnter }: { onEnter: (withSound: boolean) => void }) {
  const [entered, setEntered] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => lockScroll(!entered), [entered])
  const enter = (withSound: boolean) => {
    if (entered) return
    setEntered(true)
    onEnter(withSound)
  }
  if (gone) return null
  return (
    <div className={mod('intro', { entered })} onTransitionEnd={() => entered && setGone(true)}>
      <button type="button" className="intro__action" onClick={() => enter(true)}>
        <i className="intro__ring" />
        <span className="intro__label">{ui.intro.action}</span>
        <span className="intro__note">{ui.intro.note}</span>
      </button>
      <button type="button" className="intro__muted" onClick={() => enter(false)}>
        {ui.intro.muted}
      </button>
    </div>
  )
}
