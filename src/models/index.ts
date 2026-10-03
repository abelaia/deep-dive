export type ZoneId = 'surface' | 'sunlight' | 'twilight' | 'midnight' | 'abyss'

export interface Zone {
  id: ZoneId
  nav: string
  from: number
  kicker: string
  title: string
  text: string
  height: number
}

export type CreatureId = 'angler' | 'hatchet' | 'vampire' | 'gulper'

export interface Creature {
  id: CreatureId
  name: string
  latin: string
  x: number
  y: number
  size: number
}

export interface SpectrumColor {
  name: string
  color: string
  depth: number
}

export interface OceanConfig {
  maxDepth: number
  crackAt: number
  lightOnePercentAt: number
  temperature: [depth: number, celsius: number][]
  spectrum: SpectrumColor[]
}

export type FaunaArt = 'tropical' | 'turtle' | 'manta' | 'shark' | 'squid' | 'lanternfish' | 'siphonophore' | 'combjelly' | 'dumbo'

export interface FaunaMember {
  art: FaunaArt
  zone: ZoneId
  y: number
  size: number
  duration: number
  delay: number
  direction: 'left' | 'right' | 'up'
  color: string
}
