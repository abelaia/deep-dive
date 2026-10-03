import { device, rand } from '../../lib/layout'
import { pointer } from '../../lib/pointer'
import { storyState } from '../../animation/storyState'
import { PARTICLES } from '../../constants/config'
import { palette } from '../../constants/palette'
import { useCanvas, type CanvasView } from '../../hooks/useCanvas'

interface Speck {
  x: number
  y: number
  size: number
  speed: number
  phase: number
  layer: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  age: number
}

const spawn = (width: number, height: number, sizes: [number, number], speeds: [number, number], layer = 0): Speck => ({
  x: rand(0, width),
  y: rand(0, height),
  size: rand(...sizes),
  speed: rand(...speeds),
  phase: rand(0, Math.PI * 2),
  layer,
})

const wrap = (value: number, max: number) => ((value % max) + max) % max

const createScene = () => {
  let snow: Speck[] = []
  let bubbles: Speck[] = []
  let motes: Speck[] = []
  let sparks: Spark[] = []
  let speed = 0
  let last = { x: 0, y: 0 }
  return {
    setup(width: number, height: number) {
      snow = Array.from({ length: PARTICLES.snow[device()] }, () => spawn(width, height, [0.6, 2], [0.15, 0.5]))
      bubbles = Array.from({ length: PARTICLES.bubbles[device()] }, () => spawn(width, height, [2, 7], [0.6, 1.8]))
      motes = Array.from({ length: PARTICLES.motes[device()] }, (_, i) => spawn(width, height, [0.8, 2.6], [0.05, 0.2], i % 2))
    },
    draw(ctx: CanvasRenderingContext2D, { width, height, left, top, time }: CanvasView) {
      const { snow: snowLevel, bubbles: bubbleLevel, motes: moteLevel, sparks: sparkLevel } = storyState
      speed += (storyState.speed - speed) * PARTICLES.speedEase
      if (snowLevel + bubbleLevel + moteLevel + sparkLevel + sparks.length < 0.01) return false

      ctx.fillStyle = palette.snow
      motes.forEach((mote) => {
        mote.y = wrap(mote.y - speed * PARTICLES.parallax[mote.layer] - mote.speed, height)
        ctx.globalAlpha = moteLevel * (mote.layer ? 0.9 : 0.4)
        const stretch = Math.min(18, Math.abs(speed) * PARTICLES.parallax[mote.layer] * 2)
        ctx.fillRect(mote.x + Math.sin(time * 0.5 + mote.phase) * 4, mote.y, mote.size, mote.size + stretch)
      })

      ctx.globalAlpha = snowLevel
      snow.forEach((speck) => {
        speck.y = wrap(speck.y + speck.speed - speed * 0.2, height)
        ctx.fillRect(speck.x + Math.sin(time * 0.6 + speck.phase) * 6, speck.y, speck.size, speck.size)
      })

      ctx.globalAlpha = bubbleLevel
      ctx.strokeStyle = palette.bubble
      ctx.beginPath()
      bubbles.forEach((bubble) => {
        bubble.y = wrap(bubble.y - bubble.speed - speed * 0.25, height + 20)
        const x = bubble.x + Math.sin(time * 2 + bubble.phase) * 4
        ctx.moveTo(x + bubble.size, bubble.y)
        ctx.arc(x, bubble.y, bubble.size, 0, Math.PI * 2)
      })
      ctx.stroke()

      const local = { x: pointer.x - left, y: pointer.y - top }
      const moved = Math.hypot(local.x - last.x, local.y - last.y)
      if (sparkLevel > 0.5 && moved > 2 && local.x > 0 && local.y > 0 && local.x < width && local.y < height) {
        for (let i = 0; i < PARTICLES.sparks.perMove; i++) {
          sparks.push({ x: local.x + rand(-10, 10), y: local.y + rand(-10, 10), vx: rand(-0.4, 0.4), vy: rand(-0.6, 0.2), age: 0 })
        }
        sparks = sparks.slice(-PARTICLES.sparks.max)
      }
      last = local
      ctx.fillStyle = palette.spark
      sparks = sparks.filter((spark) => {
        spark.age += 1 / 60
        spark.x += spark.vx
        spark.y += spark.vy
        const life = 1 - spark.age / PARTICLES.sparks.life
        if (life <= 0) return false
        ctx.globalAlpha = life * life
        ctx.beginPath()
        ctx.arc(spark.x, spark.y, 1.6 * life + 0.4, 0, Math.PI * 2)
        ctx.fill()
        return true
      })
      ctx.globalAlpha = 1
      return true
    },
  }
}

export function Particles() {
  const ref = useCanvas(createScene, PARTICLES.maxDpr)
  return <canvas ref={ref} className="porthole__canvas" />
}
