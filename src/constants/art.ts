import type { CreatureId, FaunaArt } from '../models'
import { CRACK } from './config'

interface Glow {
  cx: number
  cy: number
  r: number
}

export interface CreatureArt {
  viewBox: string
  body: string
  strokes: string[]
  eye?: Glow
  glows: Glow[]
}

const wavePath = (amplitude: number, wavelength: number, width = 2880, height = 120) => {
  const base = height / 2
  const segments = Array.from({ length: width / wavelength }, (_, i) => {
    const x = i * wavelength
    return `Q ${x + wavelength / 4} ${base - amplitude} ${x + wavelength / 2} ${base} T ${x + wavelength} ${base}`
  })
  return `M0 ${base} ${segments.join(' ')} V ${height} H 0 Z`
}

export const WAVES = {
  viewBox: '0 0 2880 120',
  layers: [
    { d: wavePath(18, 360), color: 'var(--c-wave-1)', duration: 1 },
    { d: wavePath(14, 480), color: 'var(--c-wave-2)', duration: 1.6 },
    { d: wavePath(10, 240), color: 'var(--c-wave-3)', duration: 0.7 },
  ],
}

export const WHALE = {
  viewBox: '0 0 300 90',
  body: 'M0 40 C 30 20, 90 14, 160 20 C 200 24, 240 28, 268 36 L 298 18 L 292 40 L 298 62 L 268 46 C 230 58, 170 64, 112 62 L 92 84 L 84 62 C 50 60, 16 54, 0 40 Z',
}

export const JELLY = {
  viewBox: '0 0 100 160',
  bell: 'M8 44 C 8 10, 92 10, 92 44 C 82 40, 72 48, 62 42 C 52 48, 42 40, 32 46 C 22 40, 14 48, 8 44 Z',
  tentacles: [
    'M24 46 C 18 80, 30 100, 22 150',
    'M40 46 C 36 84, 48 104, 40 156',
    'M58 46 C 64 84, 52 106, 60 154',
    'M76 46 C 82 80, 70 100, 78 148',
  ],
  swarm: [
    { x: 30, y: 30, size: 13, delay: 0 },
    { x: 66, y: 56, size: 18, delay: -2 },
    { x: 62, y: 20, size: 9, delay: -4 },
    { x: 40, y: 70, size: 10, delay: -1 },
    { x: 20, y: 54, size: 7, delay: -3 },
  ],
}

export const CREATURES: Record<CreatureId, CreatureArt> = {
  angler: {
    viewBox: '0 0 200 150',
    body: 'M34 92 C 30 56, 70 30, 116 38 C 146 44, 166 60, 174 78 L 196 62 L 192 90 L 198 116 L 172 98 C 160 118, 118 132, 80 126 C 52 122, 36 110, 34 92 Z M110 122 L 120 144 L 132 122 Z',
    strokes: ['M36 90 L 42 82 L 48 92 L 54 82 L 60 93 L 66 83 L 72 94 L 78 85 L 84 96', 'M78 38 C 70 12, 40 4, 26 20'],
    eye: { cx: 70, cy: 62, r: 5 },
    glows: [{ cx: 26, cy: 22, r: 6 }],
  },
  hatchet: {
    viewBox: '0 0 120 90',
    body: 'M12 44 C 22 16, 58 8, 82 24 L 112 14 L 106 44 L 112 72 L 82 62 C 60 82, 22 76, 12 44 Z',
    strokes: ['M40 30 C 50 44, 50 56, 42 66'],
    eye: { cx: 30, cy: 36, r: 6 },
    glows: Array.from({ length: 6 }, (_, i) => ({ cx: 30 + i * 9, cy: 66 - Math.abs(i - 2.5) * 1.6, r: 2.4 })),
  },
  vampire: {
    viewBox: '0 0 120 150',
    body: 'M60 8 C 86 8, 96 40, 90 72 L 30 72 C 24 40, 34 8, 60 8 Z M34 30 L 14 22 L 22 44 Z M86 30 L 106 22 L 98 44 Z M30 70 C 18 100, 8 124, 14 142 C 32 122, 44 118, 60 140 C 76 118, 88 122, 106 142 C 112 124, 102 100, 90 70 Z',
    strokes: ['M40 74 C 34 100, 30 116, 28 132', 'M60 74 V 136', 'M80 74 C 86 100, 90 116, 92 132'],
    glows: [
      { cx: 46, cy: 50, r: 6 },
      { cx: 74, cy: 50, r: 6 },
    ],
  },
  gulper: {
    viewBox: '0 0 280 120',
    body: 'M14 56 C 14 22, 64 8, 98 34 L 112 50 C 150 52, 210 58, 274 54 C 212 64, 150 70, 112 70 C 92 100, 26 104, 14 56 Z',
    strokes: ['M20 58 C 50 60, 80 56, 108 52'],
    eye: { cx: 40, cy: 34, r: 3.5 },
    glows: [{ cx: 272, cy: 54, r: 5 }],
  },
}

const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const crackPaths = () => {
  const random = seeded(CRACK.seed)
  const [ox, oy] = CRACK.origin
  return Array.from({ length: CRACK.branches }, (_, i) => {
    let angle = (i / CRACK.branches) * Math.PI * 2 + random() * 0.6
    let [x, y] = [ox, oy]
    const points = [`M${ox} ${oy}`]
    for (let step = 0; step < CRACK.segments; step++) {
      const length = (CRACK.reach / CRACK.segments) * (0.5 + random())
      angle += (random() - 0.5) * 0.9
      x += Math.cos(angle) * length
      y += Math.sin(angle) * length
      points.push(`L${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return points.join(' ')
  })
}

export const CRACKS = { viewBox: '0 0 100 100', paths: crackPaths(), rings: [3, 7] }

export const RIVETS = 16

export interface FaunaPart {
  d: string
  kind: 'body' | 'stroke' | 'glow' | 'rainbow' | 'eye'
}

export interface FaunaArtwork {
  viewBox: string
  facing: 'left' | 'right' | 'up'
  parts: FaunaPart[]
}

const beads = (count: number, width: number, wave: number) =>
  Array.from({ length: count }, (_, i) => {
    const x = 4 + (i * (width - 8)) / (count - 1)
    const y = 10 + Math.sin(i * 0.7) * wave
    return `M${x.toFixed(1)} ${y.toFixed(1)} m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0`
  }).join(' ')

const dots = (points: [number, number][], r = 1.2) =>
  points.map(([x, y]) => `M${x} ${y} m-${r} 0 a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 -${r * 2} 0`).join(' ')

export const FAUNA: Record<FaunaArt, FaunaArtwork> = {
  tropical: {
    viewBox: '0 0 60 30',
    facing: 'left',
    parts: [
      { d: 'M4 15 C 14 3, 34 3, 44 15 L 58 5 L 56 15 L 58 25 L 44 15 C 34 27, 14 27, 4 15 Z', kind: 'body' },
      { d: 'M22 6 C 24 12, 24 18, 22 24', kind: 'stroke' },
      { d: dots([[12, 13]], 1.6), kind: 'eye' },
    ],
  },
  turtle: {
    viewBox: '0 0 120 80',
    facing: 'right',
    parts: [
      { d: 'M56 22 L 70 2 L 74 24 Z M56 58 L 72 78 L 76 56 Z M34 32 L 18 22 L 30 40 Z M34 50 L 16 60 L 30 46 Z', kind: 'body' },
      { d: 'M92 36 C 104 32, 114 36, 112 44 C 108 50, 98 48, 92 44 Z', kind: 'body' },
      { d: 'M30 40 C 30 18, 80 14, 92 36 C 96 50, 80 62, 56 62 C 40 62, 30 54, 30 40 Z', kind: 'body' },
      { d: 'M44 28 L 60 40 L 44 54 M60 40 L 82 40 M60 22 L 60 40 L 60 60', kind: 'stroke' },
      { d: dots([[106, 39]], 1.6), kind: 'eye' },
    ],
  },
  manta: {
    viewBox: '0 0 140 80',
    facing: 'left',
    parts: [{ d: 'M2 40 C 20 34, 34 14, 60 10 C 80 8, 92 26, 96 36 L 138 40 L 96 44 C 92 54, 80 72, 60 70 C 34 66, 20 46, 2 40 Z', kind: 'body' }],
  },
  shark: {
    viewBox: '0 0 220 70',
    facing: 'left',
    parts: [
      { d: 'M2 38 C 30 26, 80 22, 120 24 L 136 4 L 144 26 C 170 28, 190 32, 200 30 L 218 12 L 212 36 L 218 60 L 198 42 C 170 46, 120 50, 80 48 L 70 62 L 62 48 C 40 46, 16 44, 2 38 Z', kind: 'body' },
      { d: 'M34 32 C 36 36, 36 40, 34 44 M40 31 C 42 36, 42 40, 40 45', kind: 'stroke' },
    ],
  },
  squid: {
    viewBox: '0 0 60 140',
    facing: 'up',
    parts: [
      { d: 'M30 2 C 44 20, 46 50, 40 70 L 20 70 C 14 50, 16 20, 30 2 Z', kind: 'body' },
      { d: 'M22 70 C 18 100, 24 120, 18 138 M30 70 V 136 M38 70 C 42 100, 36 120, 42 138', kind: 'stroke' },
      { d: dots([[24, 58], [36, 58]], 2.2), kind: 'eye' },
    ],
  },
  lanternfish: {
    viewBox: '0 0 40 20',
    facing: 'left',
    parts: [
      { d: 'M2 10 C 10 2, 26 2, 32 10 L 40 4 L 38 10 L 40 16 L 32 10 C 26 18, 10 18, 2 10 Z', kind: 'body' },
      { d: dots([[9, 13], [14, 14], [19, 14], [24, 13], [7, 8]]), kind: 'glow' },
    ],
  },
  siphonophore: {
    viewBox: '0 0 200 20',
    facing: 'left',
    parts: [
      { d: 'M4 10 C 50 4, 100 16, 196 10', kind: 'stroke' },
      { d: beads(18, 200, 3), kind: 'glow' },
    ],
  },
  combjelly: {
    viewBox: '0 0 40 60',
    facing: 'up',
    parts: [
      { d: 'M20 2 C 34 2, 38 30, 32 50 C 28 58, 12 58, 8 50 C 2 30, 6 2, 20 2 Z', kind: 'body' },
      { d: 'M12 8 C 8 24, 8 38, 12 52 M20 4 V 56 M28 8 C 32 24, 32 38, 28 52', kind: 'rainbow' },
    ],
  },
  dumbo: {
    viewBox: '0 0 100 90',
    facing: 'right',
    parts: [
      { d: 'M26 28 C 10 18, 4 30, 14 40 C 20 44, 24 40, 26 36 Z M74 28 C 90 18, 96 30, 86 40 C 80 44, 76 40, 74 36 Z', kind: 'body' },
      { d: 'M28 60 C 26 76, 34 88, 42 80 C 46 88, 54 88, 58 80 C 66 88, 74 76, 72 60 Z', kind: 'body' },
      { d: 'M50 10 C 74 10, 82 34, 76 52 C 72 62, 62 66, 50 66 C 38 66, 28 62, 24 52 C 18 34, 26 10, 50 10 Z', kind: 'body' },
      { d: dots([[40, 40], [60, 40]], 3), kind: 'eye' },
    ],
  },
}

export const SEABED = {
  viewBox: '0 0 400 120',
  ground: 'M0 60 C 40 40, 80 70, 130 52 C 180 34, 220 66, 270 50 C 320 34, 360 60, 400 46 V 120 H 0 Z',
  ridge: 'M0 84 C 60 70, 120 92, 200 80 C 280 68, 340 90, 400 78 V 120 H 0 Z',
  xenophyophores: [
    { cx: 70, cy: 62, r: 7 },
    { cx: 226, cy: 60, r: 5 },
    { cx: 330, cy: 50, r: 6 },
  ],
  cucumber: {
    viewBox: '0 0 80 40',
    body: 'M6 30 C 6 14, 30 8, 54 12 C 70 14, 78 22, 74 30 Z',
    legs: 'M14 30 l -2 8 M26 30 l -1 8 M38 30 v 8 M50 30 l 1 8 M62 30 l 2 8 M60 13 l 4 -10 M66 16 l 8 -8',
  },
  herd: [
    { x: 30, size: 7, duration: 60, delay: -10 },
    { x: 60, size: 5, duration: 80, delay: -40 },
  ],
}
