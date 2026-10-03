import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { storyState } from '../../animation/storyState'
import { ocean, ui } from '../../content'
import './Spectrum.scss'

export function Spectrum() {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current!
    const bars = [...root.querySelectorAll<HTMLElement>('.spectrum__bar')]
    const caption = root.querySelector<HTMLElement>('.spectrum__caption')!
    const update = () => {
      const lost = ocean.spectrum.findLast((color) => storyState.depth >= color.depth)
      bars.forEach((bar, i) => bar.classList.toggle('spectrum__bar--lost', storyState.depth >= ocean.spectrum[i].depth))
      caption.textContent = lost ? `${ui.spectrum.lost}: ${lost.name}` : ui.spectrum.none
    }
    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [])
  return (
    <div ref={rootRef} className="spectrum">
      <div className="spectrum__bars">
        {ocean.spectrum.map(({ name, color, depth }) => (
          <div key={name} className="spectrum__item">
            <i className="spectrum__bar" style={{ background: color }} />
            <span className="spectrum__depth">
              {depth} {ui.units.depth}
            </span>
          </div>
        ))}
      </div>
      <p className="spectrum__caption">{ui.spectrum.none}</p>
    </div>
  )
}
