import { device, rand } from '../../lib/layout'
import { pointer } from '../../lib/pointer'
import { storyState } from '../../animation/storyState'
import { FISH } from '../../constants/config'
import { palette } from '../../constants/palette'
import { useCanvas, type CanvasView } from '../../hooks/useCanvas'

interface Fish {
  x: number
  y: number
  vx: number
  vy: number
}

const limit = (fish: Fish) => {
  const speed = Math.hypot(fish.vx, fish.vy) || 1
  const clamped = Math.min(FISH.speed.max, Math.max(FISH.speed.min, speed))
  fish.vx = (fish.vx / speed) * clamped
  fish.vy = (fish.vy / speed) * clamped
}

const steer = (fish: Fish, school: Fish[], { width, height, left, top }: CanvasView) => {
  const { radius, weight, flee } = FISH
  const sum = { sx: 0, sy: 0, ax: 0, ay: 0, cx: 0, cy: 0, near: 0 }
  for (const other of school) {
    if (other === fish) continue
    const [dx, dy] = [other.x - fish.x, other.y - fish.y]
    const distance = Math.hypot(dx, dy)
    if (distance < radius.separation) {
      sum.sx -= dx
      sum.sy -= dy
    }
    if (distance < radius.alignment) {
      sum.ax += other.vx
      sum.ay += other.vy
    }
    if (distance < radius.cohesion) {
      sum.cx += other.x
      sum.cy += other.y
      sum.near++
    }
  }
  fish.vx += sum.sx * weight.separation
  fish.vy += sum.sy * weight.separation
  if (sum.near) {
    fish.vx += (sum.ax / sum.near - fish.vx) * weight.alignment + (sum.cx / sum.near - fish.x) * weight.cohesion
    fish.vy += (sum.ay / sum.near - fish.vy) * weight.alignment + (sum.cy / sum.near - fish.y) * weight.cohesion
  }
  const { x, y } = FISH.area
  if (fish.x < width * x[0]) fish.vx += weight.bounds * 10
  if (fish.x > width * x[1]) fish.vx -= weight.bounds * 10
  if (fish.y < height * y[0]) fish.vy += weight.bounds * 10
  if (fish.y > height * y[1]) fish.vy -= weight.bounds * 10
  const [px, py] = [fish.x - (pointer.x - left), fish.y - (pointer.y - top)]
  const fromPointer = Math.hypot(px, py)
  if (pointer.active && fromPointer < flee.radius) {
    const push = (1 - fromPointer / flee.radius) * flee.force * 4
    fish.vx += (px / (fromPointer || 1)) * push
    fish.vy += (py / (fromPointer || 1)) * push
  }
  limit(fish)
}

const createScene = () => {
  let school: Fish[] = []
  return {
    setup(width: number, height: number) {
      const { x, y } = FISH.area
      school = Array.from({ length: FISH.count[device()] }, () => ({
        x: rand(width * x[0], width * x[1]),
        y: rand(height * y[0], height * y[1]),
        vx: rand(-1, 1),
        vy: rand(-0.5, 0.5),
      }))
    },
    draw(ctx: CanvasRenderingContext2D, view: CanvasView) {
      if (storyState.fish < 0.01) return false
      ctx.globalAlpha = storyState.fish
      ctx.fillStyle = palette.fish
      for (const fish of school) {
        steer(fish, school, view)
        fish.x += fish.vx
        fish.y += fish.vy
        const angle = Math.atan2(fish.vy, fish.vx)
        const length = FISH.length
        ctx.save()
        ctx.translate(fish.x, fish.y)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.ellipse(0, 0, length * 0.55, length * 0.2, 0, 0, Math.PI * 2)
        ctx.moveTo(-length * 0.45, 0)
        ctx.lineTo(-length * 0.85, -length * 0.22)
        ctx.lineTo(-length * 0.85, length * 0.22)
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = 1
      return true
    },
  }
}

export function FishSchool() {
  const ref = useCanvas(createScene, FISH.maxDpr)
  return <canvas ref={ref} className="porthole__canvas" />
}
