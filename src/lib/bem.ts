export const mod = (base: string, modifiers: Record<string, boolean | undefined> = {}) =>
  [base, ...Object.keys(modifiers).filter((name) => modifiers[name]).map((name) => `${base}--${name}`)].join(' ')
