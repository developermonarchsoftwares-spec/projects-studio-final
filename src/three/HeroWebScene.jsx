import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import useMousePointer from '../hooks/useMousePointer.js'

function useResponsiveConfig() {
  const { size, camera } = useThree()

  return useMemo(() => {
    const width = size.width || 1200
    const isMobile = width < 640
    const isTablet = width >= 640 && width < 1024
    const config = {
      cameraZ: isMobile ? 8.6 : isTablet ? 8 : 7.2,
      fov: isMobile ? 58 : isTablet ? 52 : 46,
      scale: isMobile ? 0.82 : isTablet ? 0.95 : 1.12,
      sparkles: isMobile ? 28 : isTablet ? 42 : 58,
      xOffset: isMobile ? 0.55 : isTablet ? 0.9 : 1.28,
    }

    camera.fov = config.fov
    camera.updateProjectionMatrix()
    return config
  }, [camera, size.width])
}

function FloatingPanel({ panel, config, pointerRef }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    if (!group.current) return
    const pointerX = pointerRef?.current?.x || 0
    const pointerY = pointerRef?.current?.y || 0
    const time = state.clock.elapsedTime
    const flowX = Math.cos(time * panel.speed + panel.phase) * panel.travel
    const flowY = Math.sin(time * panel.speed * 0.82 + panel.phase) * panel.travel * 0.72

    group.current.position.x += (panel.position[0] + flowX + pointerX * panel.mouse - group.current.position.x) * 0.055
    group.current.position.y += (panel.position[1] + flowY + pointerY * panel.mouse * 0.72 - group.current.position.y) * 0.055
    group.current.position.z += (panel.position[2] + Math.sin(time * 0.4 + panel.phase) * 0.24 - group.current.position.z) * 0.045
    group.current.rotation.x += delta * panel.spin[0] + (pointerY * 0.18 - group.current.rotation.x) * 0.012
    group.current.rotation.y += delta * panel.spin[1] + (pointerX * 0.28 - group.current.rotation.y) * 0.012
    group.current.rotation.z += delta * panel.spin[2]
  })

  return (
    <group ref={group} position={panel.position} rotation={panel.rotation} scale={config.scale * panel.scale}>
      <mesh>
        <boxGeometry args={[panel.size[0], panel.size[1], panel.size[2]]} />
        <meshStandardMaterial
          color="#03070d"
          emissive="#06111d"
          emissiveIntensity={0.34}
          metalness={0.4}
          roughness={0.34}
          transparent
          opacity={0.68}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[panel.size[0], panel.size[1], panel.size[2]]} />
        <meshBasicMaterial color={panel.color} wireframe transparent opacity={panel.opacity} />
      </mesh>
      <mesh position={[panel.size[0] * 0.18, panel.size[1] * 0.08, panel.size[2] * 0.56]}>
        <boxGeometry args={[panel.size[0] * 0.28, 0.018, 0.018]} />
        <meshBasicMaterial color="#32c8ff" transparent opacity={0.42} />
      </mesh>
    </group>
  )
}

function FloatingWirePanels({ config, pointerRef }) {
  const panels = useMemo(() => {
    const base = [
      { position: [2.2, 0.9, -0.8], rotation: [0.18, -0.55, 0.1], size: [1.02, 2.6, 0.16], scale: 1, color: '#2d94c7', opacity: 0.34, speed: 0.52, travel: 0.48, mouse: 0.7, spin: [0.03, 0.08, 0.025] },
      { position: [3.55, -1.05, -1.25], rotation: [-0.28, 0.66, -0.32], size: [1.65, 0.9, 0.14], scale: 0.96, color: '#ffffff', opacity: 0.2, speed: 0.42, travel: 0.62, mouse: 0.92, spin: [-0.035, 0.05, -0.03] },
      { position: [0.85, -1.25, -1.55], rotation: [0.42, -0.18, 0.28], size: [1.38, 1.74, 0.12], scale: 0.86, color: '#ed1d24', opacity: 0.26, speed: 0.68, travel: 0.34, mouse: 0.55, spin: [0.04, -0.045, 0.05] },
      { position: [-2.95, 1.25, -1.9], rotation: [0.1, 0.52, -0.2], size: [1.85, 1.06, 0.1], scale: 0.78, color: '#ffffff', opacity: 0.16, speed: 0.46, travel: 0.72, mouse: 0.48, spin: [0.018, -0.06, 0.022] },
      { position: [-1.15, -1.85, -2.4], rotation: [-0.44, -0.36, 0.42], size: [1.1, 1.44, 0.14], scale: 0.72, color: '#32c8ff', opacity: 0.22, speed: 0.76, travel: 0.52, mouse: 0.62, spin: [-0.025, 0.07, -0.04] },
      { position: [4.2, 1.65, -2.25], rotation: [0.2, -0.28, 0.58], size: [0.72, 1.24, 0.1], scale: 0.68, color: '#ffffff', opacity: 0.16, speed: 0.58, travel: 0.56, mouse: 0.72, spin: [0.035, 0.035, -0.05] },
    ]

    return base.map((panel, key) => ({
      ...panel,
      key,
      phase: key * 1.83,
    }))
  }, [])

  return (
    <>
      {panels.map((panel) => (
        <FloatingPanel key={panel.key} panel={panel} config={config} pointerRef={pointerRef} />
      ))}
    </>
  )
}

function ElectricCursor({ config, pointerRef }) {
  const group = useRef(null)
  const bolt = useRef(null)
  const branches = useRef(null)
  const glow = useRef(null)
  const light = useRef(null)
  const boltPositions = useMemo(() => new Float32Array(9 * 3), [])
  const branchPositions = useMemo(() => new Float32Array(12 * 2 * 3), [])

  useFrame((state) => {
    const pointerX = pointerRef?.current?.x || 0
    const pointerY = pointerRef?.current?.y || 0
    const targetX = pointerX * 3.2 + config.xOffset * 0.45
    const targetY = pointerY * 2.15
    const targetZ = 1.1
    const time = state.clock.elapsedTime
    const activity = Math.min(1, Math.abs(pointerX) + Math.abs(pointerY) + 0.22)

    if (!group.current || !bolt.current || !branches.current || !glow.current || !light.current) return

    group.current.position.x += (targetX - group.current.position.x) * 0.22
    group.current.position.y += (targetY - group.current.position.y) * 0.22
    group.current.position.z += (targetZ - group.current.position.z) * 0.22

    for (let i = 0; i < 9; i += 1) {
      const t = i / 8
      const crack = Math.sin(time * 22 + i * 1.7) * 0.035
      const side = (i % 2 === 0 ? -1 : 1) * (0.07 + activity * 0.05)
      const index = i * 3
      boltPositions[index] = side + crack
      boltPositions[index + 1] = -t * (1.55 + activity * 0.34)
      boltPositions[index + 2] = Math.sin(time * 9 + i) * 0.025
    }

    for (let i = 0; i < 12; i += 1) {
      const anchor = (i % 7) + 1
      const anchorIndex = anchor * 3
      const angle = time * 3.4 + i * 2.17
      const index = i * 6
      const length = 0.12 + (i % 3) * 0.055 + activity * 0.08
      branchPositions[index] = boltPositions[anchorIndex]
      branchPositions[index + 1] = boltPositions[anchorIndex + 1]
      branchPositions[index + 2] = boltPositions[anchorIndex + 2]
      branchPositions[index + 3] = boltPositions[anchorIndex] + Math.cos(angle) * length
      branchPositions[index + 4] = boltPositions[anchorIndex + 1] + Math.sin(angle) * length * 0.72
      branchPositions[index + 5] = boltPositions[anchorIndex + 2] + Math.sin(angle * 1.7) * 0.08
    }

    bolt.current.geometry.attributes.position.needsUpdate = true
    branches.current.geometry.attributes.position.needsUpdate = true
    bolt.current.material.opacity = 0.72 + activity * 0.24 + Math.sin(time * 34) * 0.08
    branches.current.material.opacity = 0.34 + activity * 0.38 + Math.sin(time * 26) * 0.1
    glow.current.material.opacity = 0.28 + activity * 0.32
    glow.current.scale.setScalar(0.26 + activity * 0.24 + Math.sin(time * 11) * 0.035)
    light.current.intensity = 1.2 + activity * 2.2
  })

  return (
    <group ref={group}>
      <line ref={bolt}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[boltPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#7ee6ff" transparent opacity={0.92} blending={THREE.AdditiveBlending} />
      </line>
      <lineSegments ref={branches}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[branchPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#32c8ff" transparent opacity={0.58} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <mesh ref={glow}>
        <sphereGeometry args={[0.44, 24, 24]} />
        <meshBasicMaterial color="#32c8ff" transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={light} color="#32c8ff" intensity={1.4} distance={4.2} />
    </group>
  )
}

function SceneContent() {
  const config = useResponsiveConfig()
  const pointerRef = useMousePointer()

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 2, 3]} intensity={1.2} color="#32c8ff" />
      <pointLight position={[-3, -2, 3]} intensity={1.1} color="#ffffff" />
      <FloatingWirePanels config={config} pointerRef={pointerRef} />
      <ElectricCursor config={config} pointerRef={pointerRef} />
      <Sparkles count={config.sparkles} scale={[7, 4.2, 4]} size={1.7} speed={0.22} color="#ffffff" opacity={0.32} />
    </>
  )
}

export default function HeroWebScene() {
  return (
    <Canvas
      className="home__hero-web-canvas"
      dpr={[1, 1.45]}
      camera={{ position: [0, 0, 7.2], fov: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <SceneContent />
    </Canvas>
  )
}
