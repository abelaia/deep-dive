import { useCallback, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { mod } from '../../lib/bem'
import { usePreloader } from '../../hooks/usePreloader'
import { PRELOADER } from '../../constants/config'
import { ui } from '../../content'
import { Button } from '../Button/Button'
import './BootScreen.scss'

interface Props {
  onEnter: (withSound: boolean) => void
}

const { title, checks, ok, withSound, withoutSound, note } = ui.boot

export function BootScreen({ onEnter }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const [passed, setPassed] = useState(0)
  const [gone, setGone] = useState(false)
  const ready = usePreloader(
    useCallback((value: number) => {
      if (!countRef.current || !rootRef.current) return
      countRef.current.textContent = String(Math.round(value)).padStart(3, '0')
      rootRef.current.style.setProperty('--p', String(value / 100))
      setPassed(Math.floor((value / 100) * checks.length))
    }, []),
  )
  const enter = (sound: boolean) => {
    onEnter(sound)
    gsap.to(rootRef.current, { autoAlpha: 0, duration: PRELOADER.exit, ease: 'steps(5)', onComplete: () => setGone(true) })
  }
  if (gone) return null
  return (
    <div ref={rootRef} className={mod('boot', { ready })}>
      <div className="boot__panel">
        <p className="boot__title">{title}</p>
        <ol className="boot__checks">
          {checks.map((check, i) => (
            <li key={check} className={mod('boot__check', { passed: i < passed, current: i === passed })}>
              <span className="boot__name">{check}</span>
              <span className="boot__leader" />
              <span className="boot__status">{i < passed ? ok : '···'}</span>
            </li>
          ))}
        </ol>
        <p className="boot__count">
          <span ref={countRef}>000</span>%
        </p>
        <i className="boot__bar" />
        <div className="boot__actions">
          <Button variant="solid" disabled={!ready} onClick={() => enter(true)}>
            {withSound}
          </Button>
          <Button disabled={!ready} onClick={() => enter(false)}>
            {withoutSound}
          </Button>
        </div>
        <p className="boot__note">{note}</p>
      </div>
    </div>
  )
}
