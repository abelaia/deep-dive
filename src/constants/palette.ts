export const palette = {
  fish: 'rgba(225, 244, 255, 0.85)',
  snow: 'rgba(220, 235, 255, 0.55)',
  bubble: 'rgba(200, 240, 255, 0.6)',
  spark: '#7dfde4',
  creatures: {
    angler: { body: '#6b3f4d', edge: 'rgba(255, 196, 206, 0.45)' },
    hatchet: { body: '#b9c7d6', edge: 'rgba(255, 255, 255, 0.6)' },
    vampire: { body: '#8a2f3a', edge: 'rgba(255, 170, 170, 0.45)' },
    gulper: { body: '#4a3f5c', edge: 'rgba(210, 190, 255, 0.45)' },
  },
}

const phosphor = { '--hud': '#9dffb0', '--hud-dim': 'rgba(157, 255, 176, 0.5)' }

export const themes = {
  surface: { '--water': '#1b8fb0', ...phosphor },
  sunlight: { '--water': '#13739a', ...phosphor },
  twilight: { '--water': '#0b3f6b', ...phosphor },
  midnight: { '--water': '#04142a', ...phosphor },
  abyss: { '--water': '#01060d', '--hud': '#ffb547', '--hud-dim': 'rgba(255, 181, 71, 0.5)' },
  alarm: { '--water': '#01060d', '--hud': '#ff4d3d', '--hud-dim': 'rgba(255, 77, 61, 0.55)' },
}

export type ThemeName = keyof typeof themes

export const applyTheme = (name: ThemeName) =>
  Object.entries(themes[name]).forEach(([key, value]) => document.documentElement.style.setProperty(key, value))
