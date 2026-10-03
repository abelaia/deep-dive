import { useLayoutEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { initSmoothScroll } from '../lib/smoothScroll'
import { buildStory } from '../animation/buildStory'

export function useStory(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const destroyScroll = initSmoothScroll()
    const ctx = gsap.context(() => buildStory(rootRef.current!), rootRef.current!)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      ctx.revert()
      destroyScroll()
    }
  }, [rootRef])
}
