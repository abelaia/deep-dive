import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

export interface CanvasView {
  width: number
  height: number
  left: number
  top: number
  time: number
}

export interface CanvasScene {
  setup: (width: number, height: number) => void
  draw: (ctx: CanvasRenderingContext2D, view: CanvasView) => boolean
}

export function useCanvas(createScene: () => CanvasScene, maxDpr: number) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const scene = createScene()
    let dirty = false

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      scene.setup(width, height)
    }
    const render = (time: number) => {
      const { width, height, left, top } = canvas.getBoundingClientRect()
      if (dirty) ctx.clearRect(0, 0, width, height)
      dirty = scene.draw(ctx, { width, height, left, top, time })
    }

    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    gsap.ticker.add(render)
    return () => {
      observer.disconnect()
      gsap.ticker.remove(render)
    }
  }, [createScene, maxDpr])
  return ref
}
