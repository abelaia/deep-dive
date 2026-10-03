import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { dive } from '../../lib/dive'
import { device } from '../../lib/layout'
import { lerp } from '../../lib/math'
import { pointer } from '../../lib/pointer'
import { createRenderer } from '../../gl/createRenderer'
import { OCEAN } from '../../constants/config'
import './Ocean.scss'

export function Ocean() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const renderer = createRenderer(canvas)
    if (!renderer) return
    const light = { x: 0, y: 0.5, strength: 0 }

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2) * OCEAN.resolution[device()]
      renderer.resize(Math.round(window.innerWidth * scale), Math.round(window.innerHeight * scale))
    }
    const render = (time: number) => {
      if (document.hidden) return
      const { innerWidth: width, innerHeight: height } = window
      const recent = pointer.active && (performance.now() - pointer.movedAt) / 1000 < OCEAN.idle
      if (pointer.active) {
        light.x = lerp(light.x, (pointer.x / width - 0.5) * (width / height), OCEAN.pointerEase)
        light.y = lerp(light.y, 1 - pointer.y / height, OCEAN.pointerEase)
      }
      light.strength = lerp(light.strength, recent ? 1 : 0, OCEAN.pointerEase * 0.5)
      renderer.render({ time, depth: dive.visual, descent: dive.descent, pointer: [light.x, light.y, light.strength] })
    }

    resize()
    gsap.ticker.add(render)
    window.addEventListener('resize', resize)
    return () => {
      gsap.ticker.remove(render)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} className="ocean" aria-hidden="true" />
}
