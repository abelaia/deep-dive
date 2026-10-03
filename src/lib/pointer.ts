export const pointer = { x: -9999, y: -9999, active: false, movedAt: 0 }

const update = (event: PointerEvent) => {
  pointer.x = event.clientX
  pointer.y = event.clientY
  pointer.active = true
  pointer.movedAt = performance.now()
}

const leave = () => {
  pointer.active = false
}

export function trackPointer() {
  window.addEventListener('pointermove', update, { passive: true })
  window.addEventListener('pointerdown', update, { passive: true })
  document.documentElement.addEventListener('pointerleave', leave)
  return () => {
    window.removeEventListener('pointermove', update)
    window.removeEventListener('pointerdown', update)
    document.documentElement.removeEventListener('pointerleave', leave)
  }
}
