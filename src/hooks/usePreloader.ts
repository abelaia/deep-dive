import { useEffect, useState } from 'react'
import { gsap } from '../lib/gsap'
import { PRELOADER } from '../constants/config'

export function usePreloader(onProgress: (value: number) => void) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const progress = { value: 0 }
    const { fakeUntil, minDuration, finish } = PRELOADER
    const to = (value: number, duration: number, ease = 'power2.out') =>
      new Promise<void>((onComplete) => gsap.to(progress, { value, duration, ease, onUpdate: () => onProgress(progress.value), onComplete }))
    let alive = true
    Promise.all([document.fonts.ready, to(fakeUntil, minDuration)])
      .then(() => (alive ? to(100, finish, 'none') : undefined))
      .then(() => alive && setReady(true))
    return () => {
      alive = false
      gsap.killTweensOf(progress)
    }
  }, [onProgress])
  return ready
}
