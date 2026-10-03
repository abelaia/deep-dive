const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name)

let breakpoint = 0

export const isMobile = () => window.innerWidth < (breakpoint ||= Number(cssVar('--bp-md')))

export const device = () => (isMobile() ? 'mobile' : 'desktop')

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const rand = (min: number, max: number) => min + Math.random() * (max - min)
