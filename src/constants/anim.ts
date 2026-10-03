export type AnimKey =
  | 'story'
  | 'cockpit'
  | 'window'
  | 'surface'
  | 'rays'
  | 'caustics'
  | 'fauna'
  | 'seabed'
  | 'whale'
  | 'jellies'
  | 'creatures'
  | 'glows'
  | 'beam'
  | 'cracks'
  | 'alarm'
  | 'ghost'
  | 'depth'
  | 'pressure'
  | 'temperature'
  | 'light'
  | 'needle'
  | 'tape'
  | 'radar'
  | 'intro'

export const anim = (key: AnimKey) => ({ 'data-anim': key })

export const animSelector = (key: AnimKey) => `[data-anim="${key}"]`
