import { useEffect, useState } from 'react'
import { zoneOffsets, zones } from '../content'
import { SCROLL } from '../constants/config'

export function useActiveZone() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const update = () => {
      const line = (window.scrollY / window.innerHeight) * 100 + SCROLL.activeLine
      setActive(zones.reduce((idx, { id }, i) => (zoneOffsets[id] <= line ? i : idx), 0))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return active
}
