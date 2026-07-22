import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 700

function useParticleData() {
  return useMemo(() => {
    const starts = new Float32Array(COUNT * 3)
    const targets = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // scattered start, in a wide box
      const r = 4 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starts[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starts[i * 3 + 2] = r * Math.cos(phi)

      // converged target, on a tight orb shell
      const tr = 1.5 + Math.random() * 0.15
      const tTheta = Math.random() * Math.PI * 2
      const tPhi = Math.acos(2 * Math.random() - 1)
      targets[i * 3] = tr * Math.sin(tPhi) * Math.cos(tTheta)
      targets[i * 3 + 1] = tr * Math.sin(tPhi) * Math.sin(tTheta)
      targets[i * 3 + 2] = tr * Math.cos(tPhi)

      seeds[i] = Math.random()
    }
    return { starts, targets, seeds }
  }, [])
}

function useResponsiveConfig() {
  const { size, camera } = useThree()
  return useMemo(() => {
    const width = size.width || 1200
    const isMobile = width < 640
    const isTablet = width >= 640 && width < 1024
    const config = {
      sceneScale: isMobile ? 0.68 : isTablet ? 0.82 : 1,
      cameraZ: isMobile ? 8.8 : isTablet ? 8.1 : 7.5,
      cameraTravel: isMobile ? 1.65 : isTablet ? 2.05 : 2.6,
      fov: isMobile ? 56 : isTablet ? 51 : 46,
      pointSize: isMobile ? 0.035 : isTablet ? 0.04 : 0.045,
    }
    camera.fov = config.fov
    camera.updateProjectionMatrix()
    return config
  }, [camera, size.width])
}

function useCircleSprite() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    const size = 64
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.72, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [])
}

function Particles({ progressRef, pointSize = 0.045, converge = true, dotOpacity = 0.85 }) {
  const pointsRef = useRef()
  const { starts, targets, seeds } = useParticleData()
  const positions = useMemo(() => new Float32Array(starts), [starts])
  const colorA = useMemo(() => new THREE.Color('#ffffff'), [])
  const colorB = useMemo(() => new THREE.Color('#ed1d24'), [])
  const circleSprite = useCircleSprite()
  const currentColor = useRef(new THREE.Color('#ffffff'))

  useFrame((state) => {
    const p = progressRef.current
    const pos = pointsRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime

    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3
      const wobble = Math.sin(t * 0.6 + seeds[i] * 10) * 0.05 * (1 - p)
      const ease = converge ? Math.min(1, p * 1.15) : 0
      pos[idx] = starts[idx] + (targets[idx] - starts[idx]) * ease + wobble
      pos[idx + 1] = starts[idx + 1] + (targets[idx + 1] - starts[idx + 1]) * ease + wobble
      pos[idx + 2] = starts[idx + 2] + (targets[idx + 2] - starts[idx + 2]) * ease + wobble
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    currentColor.current.lerpColors(colorA, colorB, p)
    pointsRef.current.material.color.copy(currentColor.current)
    pointsRef.current.rotation.y += 0.0015
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={pointSize}
        color="#ffffff"
        map={circleSprite}
        transparent
        opacity={dotOpacity}
        alphaTest={0.02}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function Beacon({ progressRef }) {
  const mesh = useRef()
  useFrame((state, delta) => {
    const p = progressRef.current
    if (!mesh.current) return
    const target = Math.max(0, (p - 0.55) / 0.45)
    mesh.current.scale.setScalar(0.9 + target * 0.5)
    mesh.current.material.opacity = target * 0.85
    mesh.current.rotation.y += delta * 0.4
    mesh.current.rotation.x += delta * 0.15
  })
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.1, 2]} />
      <meshStandardMaterial
        color="#ed1d24"
        emissive="#ed1d24"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.5}
        transparent
        opacity={0}
        wireframe
      />
    </mesh>
  )
}

function Rig({ progressRef, config }) {
  useFrame((state) => {
    const p = progressRef.current
    state.camera.position.z = config.cameraZ - p * config.cameraTravel
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Wireframe({ pointerRef }) {
  const group = useRef()
  const outer = useRef()
  const inner = useRef()
  const outerMat = useRef()
  const innerMat = useRef()
  const spark = useRef()
  const sparkMat = useRef()
  const glowTexture = useCircleSprite()

  const white = useMemo(() => new THREE.Color('#ffffff'), [])
  const red = useMemo(() => new THREE.Color('#ed1d24'), [])
  const electric = useMemo(() => new THREE.Color('#33d6ff'), [])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const velocity = useRef(0)
  const last = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const px = pointerRef?.current?.x ?? 0
    const py = pointerRef?.current?.y ?? 0

    if (group.current) {
      group.current.rotation.y += (px * 0.5 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (-py * 0.35 - group.current.rotation.x) * 0.05
    }
    if (outer.current) {
      outer.current.rotation.y += delta * 0.08
      outer.current.rotation.x += delta * 0.03
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.12
      inner.current.rotation.z += delta * 0.05
    }

    const dx = px - last.current.x
    const dy = py - last.current.y
    const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    velocity.current += (Math.min(speed, 6) - velocity.current) * 0.12
    last.current.x = px
    last.current.y = py

    const boost = Math.min(1, velocity.current * 0.4)
    const flicker = 0.6 + Math.sin(state.clock.elapsedTime * 28) * 0.4

    if (outerMat.current) {
      outerMat.current.color.copy(tmpColor.copy(white).lerp(electric, boost))
      outerMat.current.opacity = 0.12 + boost * 0.32 * flicker
    }
    if (innerMat.current) {
      innerMat.current.color.copy(tmpColor.copy(red).lerp(electric, boost))
      innerMat.current.opacity = 0.16 + boost * 0.36 * flicker
    }
    if (spark.current) {
      spark.current.position.x += (px * 3.2 - spark.current.position.x) * 0.16
      spark.current.position.y += (py * 2.2 - spark.current.position.y) * 0.16
      spark.current.scale.setScalar(0.6 + boost * 1.8 + flicker * boost * 0.4)
    }
    if (sparkMat.current) {
      sparkMat.current.opacity = 0.12 + boost * 0.7 * flicker
    }
  })

  return (
    <group ref={group}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial ref={outerMat} color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={inner} scale={0.72}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial ref={innerMat} color="#ed1d24" wireframe transparent opacity={0.16} />
      </mesh>
      <sprite ref={spark} position={[0, 0, 1.4]}>
        <spriteMaterial
          ref={sparkMat}
          map={glowTexture}
          color="#33d6ff"
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}

function SceneContent({ progressRef, showBeacon = true, convergeParticles = true, showWireframe = false, pointerRef, dotOpacity = 0.85 }) {
  const config = useResponsiveConfig()
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={1.8} color="#ed1d24" />
      <pointLight position={[-4, -3, -4]} intensity={1.3} color="#ffffff" />
      <Rig progressRef={progressRef} config={config} />
      <group scale={config.sceneScale}>
        {showWireframe && <Wireframe pointerRef={pointerRef} />}
        <Particles progressRef={progressRef} pointSize={config.pointSize} converge={convergeParticles} dotOpacity={dotOpacity} />
        {showBeacon && <Beacon progressRef={progressRef} />}
      </group>
    </>
  )
}

export default function ContactScene({ progressRef, showBeacon = true, convergeParticles = true, showWireframe = false, pointerRef, dotOpacity = 0.85 }) {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 7.5], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <SceneContent
        progressRef={progressRef}
        showBeacon={showBeacon}
        convergeParticles={convergeParticles}
        showWireframe={showWireframe}
        pointerRef={pointerRef}
        dotOpacity={dotOpacity}
      />
    </Canvas>
  )
}
