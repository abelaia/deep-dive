import { useEffect } from 'react'
import { gsap } from '../lib/gsap'
import { pointer } from '../lib/pointer'
import { storyState } from '../animation/storyState'
import { animSelector } from '../constants/anim'
import { FLASHLIGHT } from '../constants/config'
import type { CreatureId } from '../models'

const wanderTarget = (time: number, size: number) => {
  const { x, y, speed } = FLASHLIGHT.wander
  return {
    x: size * (x[0] + Math.sin(time * speed[0]) * x[1]),
    y: size * (y[0] + Math.sin(time * speed[1] + 1.3) * y[1]),
  }
}

export function useFlashlight(onFound: (id: CreatureId) => void) {
  useEffect(() => {
    const view = document.querySelector<HTMLElement>(animSelector('window'))!
    const light = { x: 0, y: 0 }
    const found = new Set<string>()

    const tick = (time: number) => {
      if (storyState.light < 0.01) return
      const box = view.getBoundingClientRect()
      const size = box.width
      const radius = size * FLASHLIGHT.radius
      const local = { x: pointer.x - box.left, y: pointer.y - box.top }
      const inside = Math.hypot(local.x - size / 2, local.y - size / 2) < size / 2
      const idle = (performance.now() - pointer.movedAt) / 1000 > FLASHLIGHT.idle
      const target = pointer.active && inside && !idle ? local : wanderTarget(time, size)
      light.x += (target.x - light.x) * FLASHLIGHT.ease
      light.y += (target.y - light.y) * FLASHLIGHT.ease
      view.style.setProperty('--fx', `${light.x.toFixed(1)}px`)
      view.style.setProperty('--fy', `${light.y.toFixed(1)}px`)
      view.style.setProperty('--fr', `${radius.toFixed(0)}px`)
      if (storyState.light < FLASHLIGHT.active) return
      view.querySelectorAll<HTMLElement>('[data-creature]').forEach((el) => {
        const id = el.dataset.creature as CreatureId
        if (found.has(id)) return
        const rect = el.getBoundingClientRect()
        const cx = rect.x + rect.width / 2 - box.left
        const cy = rect.y + rect.height / 2 - box.top
        if (Math.hypot(cx - light.x, cy - light.y) > radius * FLASHLIGHT.found + rect.width * 0.2) return
        found.add(id)
        onFound(id)
      })
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [onFound])
}
