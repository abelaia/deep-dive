import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/layout'
import { depthAt, lightAt, ocean, pressureAt, SCROLL_VH, temperatureAt, vhAt, zoneOffsets, zones } from '../content'
import type { ZoneId } from '../models'
import { themes, type ThemeName } from '../constants/palette'
import { DIAL, SCROLL } from '../constants/config'
import { animSelector, type AnimKey } from '../constants/anim'
import { resetStoryState, storyState, type StoryState } from './storyState'

const fmtNumber = new Intl.NumberFormat('ru-RU')
const fmtLight = (percent: number) => (percent >= 10 ? percent.toFixed(0) : percent.toFixed(2))

export function buildStory(root: HTMLElement) {
  const all = <T extends HTMLElement | SVGElement = HTMLElement>(key: AnimKey) => [...root.querySelectorAll<T>(animSelector(key))]
  const one = <T extends HTMLElement | SVGElement = HTMLElement>(key: AnimKey) => all<T>(key)[0]
  const text = (key: AnimKey, value: string) => {
    const el = one(key)
    if (el.textContent !== value) el.textContent = value
  }
  const html = document.documentElement
  const deepLayers = [one('creatures'), one('glows')]
  const { sunlight: L, twilight: T, midnight: M, abyss: A } = zoneOffsets
  const C = vhAt(ocean.crackAt)
  resetStoryState()
  storyState.waves = 1

  const renderReadouts = () => {
    const depth = depthAt(tl.time())
    const share = depth / ocean.maxDepth
    storyState.deep = share
    storyState.depth = depth
    text('depth', fmtNumber.format(Math.round(depth)))
    text('ghost', fmtNumber.format(Math.round(depth)))
    text('pressure', fmtNumber.format(Math.round(pressureAt(depth))))
    text('temperature', String(Math.round(temperatureAt(depth))))
    text('light', fmtLight(lightAt(depth)))
    one('needle').style.setProperty('--needle', `${(share - 0.5) * DIAL.sweep}deg`)
    one('tape').style.setProperty('--depth', depth.toFixed(1))
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: renderReadouts,
    scrollTrigger: { trigger: one('story'), start: 'top top', end: 'bottom bottom', scrub: prefersReducedMotion() || SCROLL.scrub },
  })
  const theme = (name: ThemeName, at: number, duration = 60) => tl.to(html, { ...themes[name], duration }, at)
  const state = (vars: Partial<StoryState>, at: number, duration = 40) => tl.to(storyState, { ...vars, duration }, at)
  tl.set(html, themes.surface, 0)

  tl.to(one('surface'), { yPercent: -100, duration: L + 20 }, 0)
  all('fauna').forEach((group) => {
    const index = zones.findIndex(({ id }) => id === (group.dataset.zone as ZoneId))
    const next = zones[index + 1]
    tl.fromTo(group, { autoAlpha: 0 }, { autoAlpha: 1, duration: 40 }, zoneOffsets[zones[index].id] - 40)
    if (next) tl.to(group, { autoAlpha: 0, duration: 40 }, zoneOffsets[next.id] - 10)
  })

  theme('sunlight', L - 40)
  state({ waves: 0, under: 1, fish: 1, motes: 1 }, L - 30)
  state({ bubbles: 1 }, L - 40, 10)
  state({ bubbles: 0 }, L + 30, 40)
  tl.fromTo(one('whale'), { left: '100%' }, { left: '-80%', duration: T + 80 - L }, L + 40)
  state({ whale: 1 }, L + 60)

  theme('twilight', T - 60, 100)
  tl.to([one('rays'), one('caustics')], { opacity: 0, duration: 120 }, T - 60)
  state({ fish: 0 }, T - 30, 50)
  state({ snow: 1 }, T - 20, 80)
  tl.fromTo(one('jellies'), { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 60 }, T - 20)
  tl.to(one('jellies'), { yPercent: -60, duration: 140 }, T + 40)
  tl.to(one('jellies'), { autoAlpha: 0, duration: 40 }, M - 20)
  state({ whale: 0 }, T + 60)

  theme('midnight', M - 60, 80)
  state({ light: 1, sonar: 1, sparks: 1 }, M - 40, 50)
  tl.to(one('beam'), { opacity: 1, duration: 50 }, M - 40)
  tl.fromTo(one('radar'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 30 }, M - 30)
  tl.fromTo(deepLayers, { autoAlpha: 0 }, { autoAlpha: 1, duration: 40 }, M - 30)
  tl.fromTo(deepLayers, { yPercent: 8 }, { yPercent: -8, duration: A - M + 30 }, M - 30)
  tl.to([...deepLayers, one('radar')], { autoAlpha: 0, duration: 40 }, A - 10)

  theme('abyss', A - 40)
  state({ snow: 0.5, bubbles: 1 }, A - 20, 60)
  tl.fromTo(one('seabed'), { yPercent: 100 }, { yPercent: 0, duration: vhAt(10500) - vhAt(7000), ease: 'power1.out' }, vhAt(7000))

  theme('alarm', C, 6)
  state({ crack: 1 }, C, 2)
  tl.fromTo(one('alarm'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 4 }, C)
  tl.fromTo(all('cracks'), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 8, stagger: 0.5, ease: 'power2.out' }, C)
  tl.to(one('cockpit'), { keyframes: { x: [0, -10, 9, -7, 5, -3, 0], y: [0, 4, -3, 2, -1, 0] }, duration: 6 }, C)

  tl.to({}, { duration: 0.001 }, SCROLL_VH - 0.001)
  renderReadouts()
}
