export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export const band = (from: number, to: number, fade: number, x: number) => smoothstep(from, from + fade, x) * (1 - smoothstep(to - fade, to, x))

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
