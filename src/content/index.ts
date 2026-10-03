import zonesJson from './zones.json'
import creaturesJson from './creatures.json'
import oceanJson from './ocean.json'
import faunaJson from './fauna.json'
import type { Creature, FaunaMember, OceanConfig, Zone, ZoneId } from '../models'

export { default as ui } from './ui.json'

export const zones = zonesJson as Zone[]
export const creatures = creaturesJson as Creature[]
export const ocean = oceanJson as OceanConfig
export const fauna = faunaJson as FaunaMember[]

export const zoneOffsets = {} as Record<ZoneId, number>
zones.reduce((offset, { id, height }) => (zoneOffsets[id] = offset) + height, 0)

export const SCROLL_VH = zones.reduce((sum, z) => sum + z.height, 0) - 100

const depthStops: [vh: number, depth: number][] = [...zones.map((z): [number, number] => [zoneOffsets[z.id], z.from]), [SCROLL_VH, ocean.maxDepth]]

const interpolate = (table: [number, number][], x: number, from: 0 | 1 = 0) => {
  const to = 1 - from
  const i = table.findIndex((row) => row[from] >= x)
  if (i <= 0) return table[i === 0 ? 0 : table.length - 1][to]
  const [a, b] = [table[i - 1], table[i]]
  return a[to] + ((x - a[from]) / (b[from] - a[from])) * (b[to] - a[to])
}

export const depthAt = (vh: number) => interpolate(depthStops, vh)
export const vhAt = (depth: number) => interpolate(depthStops, depth, 1)
export const temperatureAt = (depth: number) => interpolate(ocean.temperature, depth)
export const pressureAt = (depth: number) => 1 + depth / 10
export const lightAt = (depth: number) => 100 * Math.exp((-depth * Math.LN10 * 2) / ocean.lightOnePercentAt)
