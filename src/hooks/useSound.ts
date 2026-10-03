import { useCallback, useEffect, useState } from 'react'
import { soundEngine } from '../audio/SoundEngine'

export function useSound() {
  const [enabled, setEnabled] = useState(false)
  const set = useCallback((on: boolean) => {
    if (on) soundEngine.enable()
    else soundEngine.disable()
    setEnabled(on)
  }, [])
  useEffect(() => () => soundEngine.disable(), [])
  return { enabled, set, toggle: () => set(!enabled) }
}
