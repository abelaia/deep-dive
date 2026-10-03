import Lenis from 'lenis'
import { gsap } from './gsap'
import { prefersReducedMotion } from './layout'
import { SCROLL } from '../constants/config'

let lenis: Lenis | null = null

export function initSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: SCROLL.lerp, wheelMultiplier: SCROLL.wheelMultiplier })
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('page--locked', locked)
  if (locked) lenis?.stop()
  else lenis?.start()
}

export function scrollToY(y: number, duration: number = SCROLL.navDuration) {
  if (lenis) lenis.scrollTo(y, { duration })
  else window.scrollTo({ top: y })
}
