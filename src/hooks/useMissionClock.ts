import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

export function useMissionClock(running: boolean) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) return
    const start = Date.now()
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [running])
  return `T+ ${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}
