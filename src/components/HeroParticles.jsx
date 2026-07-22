import { useEffect, useMemo, useState } from 'react'
import { Particles, ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

async function initEngine(engine) {
  await loadSlim(engine)
}

export default function HeroParticles() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let timer
    if (typeof requestIdleCallback !== 'undefined') {
      timer = requestIdleCallback(() => setReady(true), { timeout: 1200 })
    } else {
      timer = setTimeout(() => setReady(true), 250)
    }

    return () => {
      if (typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(timer)
      } else {
        clearTimeout(timer)
      }
    }
  }, [])

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 40,
      particles: {
        number: {
          value: 45,
          density: { enable: true, width: 1200, height: 800 },
        },
        color: { value: ['#ffffff', '#ed1d24'] },
        shape: { type: 'circle' },
        opacity: { value: { min: 0.2, max: 0.6 } },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          color: '#ffffff',
          distance: 140,
          opacity: 0.04,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: false,
          straight: false,
          outModes: { default: 'out' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          onClick: { enable: true, mode: 'push' },
          resize: { enable: true },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.7 } },
          push: { quantity: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  )

  if (!ready) return null

  return (
    <ParticlesProvider init={initEngine}>
      <Particles id="hero-particles" className="hero-particles" options={options} />
    </ParticlesProvider>
  )
}
