import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { dive } from '../lib/dive'
import { band, smoothstep } from '../lib/math'
import { initSmoothScroll } from '../lib/smoothScroll'
import { depthAt, pressureAt, SCROLL_VH, temperatureAt, visualDepth } from '../content'
import { OCEAN } from '../constants/config'

const fmtNumber = new Intl.NumberFormat('ru-RU')

export type Readout = 'depth' | 'pressure' | 'temperature'

export const readout = (key: Readout) => ({ 'data-readout': key })

export function useDive(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const destroyScroll = initSmoothScroll()
    const root = rootRef.current!
    const style = document.documentElement.style
    const field = (key: Readout) => root.querySelector<HTMLElement>(`[data-readout="${key}"]`)!
    const write = (key: Readout, value: string) => {
      const el = field(key)
      if (el.textContent !== value) el.textContent = value
    }

    const tick = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      dive.depth = depthAt(progress * SCROLL_VH)
      dive.progress = progress
      dive.visual = visualDepth(dive.depth)
      dive.descent = dive.depth * OCEAN.descentPerMeter
      dive.waves = 1 - smoothstep(0, 0.04, dive.visual)
      dive.under = smoothstep(0, 0.04, dive.visual)
      dive.whale = band(0.3, 0.6, 0.05, dive.visual)
      dive.sonar = smoothstep(0.62, 0.68, dive.visual)
      dive.bubbles = smoothstep(0.95, 1, dive.visual)
      write('depth', fmtNumber.format(Math.round(dive.depth)))
      write('pressure', fmtNumber.format(Math.round(pressureAt(dive.depth))))
      write('temperature', String(Math.round(temperatureAt(dive.depth))))
      style.setProperty('--progress', progress.toFixed(4))
      style.setProperty('--dark', smoothstep(0.5, 0.66, dive.visual).toFixed(3))
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      destroyScroll()
    }
  }, [rootRef])
}
