import { useCallback, useEffect, useRef, useState } from 'react'
import { BootScreen } from './components/BootScreen/BootScreen'
import { Button } from './components/Button/Button'
import { Cockpit } from './components/Cockpit/Cockpit'
import { DepthTape } from './components/DepthTape/DepthTape'
import { Instruments } from './components/Instruments/Instruments'
import { Log } from './components/Log/Log'
import { Porthole } from './components/Porthole/Porthole'
import { Spectrum } from './components/Spectrum/Spectrum'
import { TopBar } from './components/TopBar/TopBar'
import { useActiveZone } from './hooks/useActiveZone'
import { useFlashlight } from './hooks/useFlashlight'
import { useSound } from './hooks/useSound'
import { useStory } from './hooks/useStory'
import { playIntro } from './animation/intro'
import { trackPointer } from './lib/pointer'
import { lockScroll, scrollToY } from './lib/smoothScroll'
import { anim } from './constants/anim'
import { SCROLL } from './constants/config'
import { ui, zones } from './content'
import type { CreatureId } from './models'

const asides = {
  sunlight: <Spectrum />,
  abyss: (
    <Button variant="danger" icon="↑" onClick={() => scrollToY(0, SCROLL.ascendDuration)}>
      {ui.ascend}
    </Button>
  ),
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const [found, setFound] = useState<CreatureId[]>([])
  const active = useActiveZone()
  const sound = useSound()
  useStory(rootRef)
  useFlashlight(useCallback((id: CreatureId) => setFound((list) => [...list, id]), []))
  useEffect(trackPointer, [])
  useEffect(() => lockScroll(!entered), [entered])

  const enter = (withSound: boolean) => {
    setEntered(true)
    sound.set(withSound)
    playIntro(rootRef.current!)
  }

  return (
    <div ref={rootRef}>
      <BootScreen onEnter={enter} />
      <Cockpit
        bar={<TopBar running={entered} found={found.length} sound={sound.enabled} onToggleSound={sound.toggle} />}
        log={<Log active={active} live={entered} asides={asides} />}
        view={<Porthole found={found} />}
        instruments={<Instruments found={found} />}
        tape={<DepthTape active={active} />}
      />
      <main className="story" {...anim('story')}>
        {zones.map(({ id, height }) => (
          <section key={id} id={id} className="story__zone" style={{ height: `${height}vh` }} />
        ))}
      </main>
    </div>
  )
}
