import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'

const POINT_COUNT = 400
const BG_COUNT = 120
const TOTAL_LENGTH = 20
const MILESTONE_T = [0.06, 0.23, 0.4, 0.57, 0.74, 0.92]
const DEFAULT_MILESTONES = [
  { year: '2021' },
  { year: '2022' },
  { year: '2023' },
  { year: '2024' },
  { year: '2025' },
  { year: '2026' },
]

function pathPoint(t) {
  return new THREE.Vector3(
    t * TOTAL_LENGTH,
    Math.sin(t * Math.PI * 7) * 0.55 * (0.4 + t * 0.6),
    Math.cos(t * Math.PI * 3.2) * 1.1
  )
}

function useResponsiveConfig() {
  const { size, camera } = useThree()
  return useMemo(() => {
    const width = size.width || 1200
    const isMobile = width < 640
    const isTablet = width >= 640 && width < 1024
    const config = {
      sceneScale: isMobile ? 0.68 : isTablet ? 0.82 : 1,
      cameraBack: isMobile ? 3.65 : isTablet ? 3.5 : 3.4,
      cameraY: isMobile ? 1.2 : isTablet ? 1.08 : 1,
      cameraZ: isMobile ? 4.25 : isTablet ? 3.55 : 3.2,
      fov: isMobile ? 56 : isTablet ? 51 : 48,
      bgScale: isMobile ? 0.62 : isTablet ? 0.78 : 1,
      sparkleCount: isMobile ? 36 : isTablet ? 52 : 70,
      sparkleScale: isMobile ? 5.4 : isTablet ? 6.6 : 8,
      yearScale: isMobile ? 1 : isTablet ? 0.96 : 0.92,
    }
    camera.fov = config.fov
    camera.updateProjectionMatrix()
    return config
  }, [camera, size.width])
}

function MovingBackground({ progressRef, scale = 1 }) {
  const group = useRef()
  const dots = useMemo(() => {
    return new Array(BG_COUNT).fill(0).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 7,
        -2 - Math.random() * 10,
      ],
      scale: 0.012 + Math.random() * 0.035,
      speed: 0.15 + Math.random() * 0.35,
      color: ['#ed1d24', '#ffffff', '#6f6f6f', '#ffffff'][i % 4],
    }))
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return
    const p = progressRef.current
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.08 + p * 0.18
    group.current.rotation.z += delta * 0.015
    group.current.children.forEach((mesh, i) => {
      const dot = dots[i]
      mesh.position.y += Math.sin(state.clock.elapsedTime * dot.speed + i) * 0.0018
      mesh.position.x += delta * dot.speed * 0.035
      if (mesh.position.x > 9) mesh.position.x = -9
    })
  })

  return (
    <group ref={group} position={[4 * scale, 0, -3]} scale={scale}>
      {dots.map((dot, i) => (
        <mesh key={i} position={dot.position} scale={dot.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={dot.color} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  )
}

function Wave({ progressRef }) {
  const lineRef = useRef()
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < POINT_COUNT; i++) {
      pts.push(pathPoint(i / (POINT_COUNT - 1)))
    }
    return pts
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    geo.setDrawRange(0, 2)
    return geo
  }, [points])

  useFrame(() => {
    const p = progressRef.current
    const count = Math.max(2, Math.floor(p * POINT_COUNT))
    geometry.setDrawRange(0, count)
  })

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.85} linewidth={2} />
    </line>
  )
}

function Milestones({ progressRef, milestones, yearScale = 1 }) {
  const refs = useRef([])
  const glowRefs = useRef([])

  useFrame(() => {
    const p = progressRef.current
    MILESTONE_T.forEach((t, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const reached = p >= t
      const target = reached ? 1 : 0.38
      mesh.scale.x += (target - mesh.scale.x) * 0.12
      mesh.scale.y = mesh.scale.x
      mesh.scale.z = mesh.scale.x
      mesh.rotation.y += 0.02
      mesh.rotation.x += 0.01
      const glow = glowRefs.current[i]
      if (glow) {
        const pulse = 1 + Math.sin(performance.now() * 0.003 + i) * 0.06
        glow.scale.setScalar((reached ? 1.38 : 0.72) * pulse)
      }
    })
  })

  return (
    <>
      {MILESTONE_T.map((t, i) => {
        const pos = pathPoint(t)
        const color = ['#ed1d24', '#ffffff', '#6f6f6f', '#ffffff', '#ed1d24', '#ffffff'][i]
        const year = milestones[i]?.year || DEFAULT_MILESTONES[i]?.year || ''
        return (
          <group key={i} position={pos}>
            <mesh ref={(el) => (glowRefs.current[i] = el)} scale={0.72}>
              <sphereGeometry args={[0.44, 32, 32]} />
              <meshBasicMaterial color={color} transparent opacity={0.16} />
            </mesh>
            <mesh ref={(el) => (refs.current[i] = el)} scale={0.38}>
              <icosahedronGeometry args={[0.32, 2]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.75}
                roughness={0.18}
                metalness={0.46}
              />
            </mesh>
            <Billboard position={[0, 0.08, 0.92]} renderOrder={40}>
              <Text
                fontSize={0.18 * yearScale}
                letterSpacing={0.03}
                anchorX="center"
                anchorY="middle"
                color="#ffffff"
                outlineWidth={0.01 * yearScale}
                outlineColor="#050505"
                frustumCulled={false}
                material-depthTest={false}
                material-depthWrite={false}
                renderOrder={41}
              >
                {year}
              </Text>
            </Billboard>
          </group>
        )
      })}
    </>
  )
}

function Rig({ progressRef, config }) {
  useFrame((state) => {
    const p = progressRef.current
    const head = pathPoint(Math.min(1, p + 0.02)).multiplyScalar(config.sceneScale)
    const cam = state.camera
    const targetPos = new THREE.Vector3(head.x - config.cameraBack, head.y + config.cameraY, head.z + config.cameraZ)
    cam.position.lerp(targetPos, 0.06)
    cam.lookAt(head.x, head.y, head.z)
  })
  return null
}

function SceneContent({ progressRef, milestones }) {
  const config = useResponsiveConfig()
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.6} color="#ed1d24" />
      <pointLight position={[-4, -2, -2]} intensity={1.2} color="#ffffff" />
      <Rig progressRef={progressRef} config={config} />
      <group scale={config.sceneScale}>
        <MovingBackground progressRef={progressRef} scale={config.bgScale} />
        <Wave progressRef={progressRef} />
        <Milestones progressRef={progressRef} milestones={milestones} yearScale={config.yearScale} />
        <Sparkles count={config.sparkleCount} scale={config.sparkleScale} size={1.8} speed={0.25} color="#ffffff" opacity={0.32} />
      </group>
    </>
  )
}

export default function AboutScene({ progressRef, milestones = DEFAULT_MILESTONES }) {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [-3.4, 1, 3.2], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <SceneContent progressRef={progressRef} milestones={milestones} />
    </Canvas>
  )
}
