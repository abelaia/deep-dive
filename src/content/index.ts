import zonesJson from './zones.json'
import oceanJson from './ocean.json'
import type { OceanConfig, Zone, ZoneId } from '../models'
import { OCEAN } from '../constants/config'

export { default as ui } from './ui.json'

export const zones = zonesJson as Zone[]
export const ocean = oceanJson as OceanConfig

export const zoneOffsets = {} as Record<ZoneId, number>
zones.reduce((offset, { id, height }) => (zoneOffsets[id] = offset) + height, 0)

export const SCROLL_VH = zones.reduce((sum, z) => sum + z.height, 0) - 100

const depthStops: [vh: number, depth: number][] = [...zones.map((z): [number, number] => [zoneOffsets[z.id], z.from]), [SCROLL_VH, ocean.maxDepth]]

const interpolate = (table: [number, number][], x: number) => {
  const i = table.findIndex((row) => row[0] >= x)
  if (i <= 0) return table[i === 0 ? 0 : table.length - 1][1]
  const [a, b] = [table[i - 1], table[i]]
  return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1])
}

export const depthAt = (vh: number) => interpolate(depthStops, vh)
export const temperatureAt = (depth: number) => interpolate(ocean.temperature, depth)
export const pressureAt = (depth: number) => 1 + depth / 10
export const visualDepth = (depth: number) => Math.log1p(depth / OCEAN.visualScale) / Math.log1p(ocean.maxDepth / OCEAN.visualScale)
