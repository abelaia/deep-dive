import { useEffect, useState } from 'react'
import { gsap } from '../lib/gsap'
import { LOG } from '../constants/config'

export function useTypewriter(text: string, live: boolean, onChar?: () => void) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!live) return
    const progress = { chars: 0 }
    let last = 0
    const tween = gsap.to(progress, {
      chars: text.length,
      duration: text.length * LOG.charDuration,
      ease: 'none',
      onUpdate: () => {
        const chars = Math.floor(progress.chars)
        if (chars === last) return
        last = chars
        if (chars % LOG.soundEvery === 0) onChar?.()
        setCount(chars)
      },
    })
    return () => {
      tween.kill()
    }
  }, [text, live, onChar])
  return { typed: text.slice(0, count), done: count >= text.length }
}
