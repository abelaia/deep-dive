import { useEffect, useRef } from 'react'
import { Button } from './components/Button/Button'
import { Caption } from './components/Caption/Caption'
import { Header } from './components/Header/Header'
import { Hud } from './components/Hud/Hud'
import { Ocean } from './components/Ocean/Ocean'
import { useActiveZone } from './hooks/useActiveZone'
import { useDive } from './hooks/useDive'
import { useSound } from './hooks/useSound'
import { trackPointer } from './lib/pointer'
import { scrollToY } from './lib/smoothScroll'
import { SCROLL } from './constants/config'
import { ui, zones } from './content'

const ascend = (
  <Button icon="↑" onClick={() => scrollToY(0, SCROLL.ascendDuration)}>
    {ui.ascend}
  </Button>
)

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const active = useActiveZone()
  const sound = useSound()
  useDive(rootRef)
  useEffect(trackPointer, [])
  return (
    <div ref={rootRef}>
      <Ocean />
      <Header sound={sound.enabled} onToggleSound={sound.toggle} />
      <Caption active={active} aside={active === zones.length - 1 ? ascend : undefined} />
      <Hud active={active} />
      <main className="story">
        {zones.map(({ id, height }) => (
          <section key={id} id={id} className="story__zone" style={{ height: `${height}vh` }} />
        ))}
      </main>
    </div>
  )
}
