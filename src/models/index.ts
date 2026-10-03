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

export interface OceanConfig {
  maxDepth: number
  temperature: [depth: number, celsius: number][]
}
