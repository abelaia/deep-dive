export const SCROLL = {
  lerp: 0.07,
  wheelMultiplier: 0.8,
  navDuration: 2.4,
  ascendDuration: 7,
  activeLine: 45,
} as const

export const OCEAN = {
  resolution: { mobile: 0.55, desktop: 0.8 },
  visualScale: 20,
  descentPerMeter: 1 / 180,
  pointerEase: 0.1,
  idle: 3,
} as const

export const SOUND = {
  master: 0.6,
  fade: 0.4,
  smoothing: 0.15,
  levels: { waves: 0.55, under: 0.5, pad: 0.16, whale: 0.32, sonar: 0.2, bubble: 0.22 },
  cutoff: { max: 1100, min: 90 },
  sonarEvery: 4.5,
  whaleRate: 0.004,
  bubbleRate: 0.06,
} as const
