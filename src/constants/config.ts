export const SCROLL = {
  lerp: 0.06,
  wheelMultiplier: 0.7,
  scrub: 1.4,
  navDuration: 2.4,
  ascendDuration: 7,
  activeLine: 45,
} as const

export const PRELOADER = {
  fakeUntil: 90,
  minDuration: 2.2,
  finish: 0.4,
  exit: 1,
} as const

export const INTRO = { delay: 0.2, duration: 0.9, stagger: 0.12 } as const

export const LOG = { charDuration: 0.016, soundEvery: 2 } as const

export const TAPE = { pxPerMeter: 1, minor: 100, major: 500 } as const

export const DIAL = { sweep: 270, majorKm: 1, labelEvery: 2, minorPerMajor: 2 } as const

export const CRACK = { branches: 9, segments: 6, reach: 46, seed: 7, origin: [70, 68] } as const

export const FISH = {
  count: { mobile: 50, desktop: 90 },
  speed: { min: 1.1, max: 2.4 },
  radius: { separation: 16, alignment: 42, cohesion: 64 },
  weight: { separation: 0.06, alignment: 0.05, cohesion: 0.004, bounds: 0.04 },
  flee: { radius: 120, force: 0.9 },
  area: { x: [0.14, 0.86], y: [0.18, 0.82] },
  length: 10,
  maxDpr: 2,
} as const

export const PARTICLES = {
  snow: { mobile: 90, desktop: 180 },
  bubbles: { mobile: 24, desktop: 44 },
  motes: { mobile: 50, desktop: 110 },
  parallax: [0.12, 0.32],
  speedEase: 0.08,
  sparks: { perMove: 3, life: 1.1, max: 260 },
  maxDpr: 2,
} as const

export const FLASHLIGHT = {
  radius: 0.24,
  ease: 0.14,
  idle: 2.5,
  wander: { x: [0.5, 0.26], y: [0.5, 0.24], speed: [0.21, 0.29] },
  found: 0.55,
  active: 0.6,
} as const

export const SOUND = {
  master: 0.6,
  fade: 0.4,
  smoothing: 0.15,
  levels: { waves: 0.55, under: 0.5, pad: 0.16, whale: 0.32, sonar: 0.2, bubble: 0.22, type: 0.05, creak: 0.3, crack: 0.7, alarm: 0.06 },
  cutoff: { max: 1100, min: 90 },
  sonarEvery: 4.5,
  alarmEvery: 1.4,
  whaleRate: 0.004,
  bubbleRate: 0.06,
  creakRate: 0.0025,
} as const
