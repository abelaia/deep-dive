import { gsap } from '../lib/gsap'
import { animSelector } from '../constants/anim'
import { INTRO } from '../constants/config'

export function playIntro(root: HTMLElement) {
  const { delay, duration, stagger } = INTRO
  gsap.from(root.querySelectorAll(animSelector('intro')), {
    autoAlpha: 0,
    duration,
    stagger,
    delay,
    ease: 'steps(6)',
  })
}
