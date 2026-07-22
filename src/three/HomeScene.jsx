import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const SHARD_COUNT = 26

function useShardData() {
  return useMemo(() => {
    return new Array(SHARD_COUNT).fill(0).map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / SHARD_COUNT)
      const theta = Math.sqrt(SHARD_COUNT * Math.PI) * phi
      const dir = new THREE.Vector3().setFromSphericalCoords(1, phi, theta)
      return {
        dir,
        speed: 0.4 + Math.random() * 0.8,
        scale: 0.08 + Math.random() * 0.14,
        spin: (Math.random() - 0.5) * 2,
        color: ['#ed1d24', '#ffffff', '#6f6f6f'][i % 3],
      }
    })
  }, [])
}

function useResponsiveConfig() {
  const { size, camera } = useThree()
  return useMemo(() => {
    const width = size.width || 1200
    const isMobile = width < 640
    const isTablet = width >= 640 && width < 1024
    const config = {
      sceneScale: isMobile ? 0.64 : isTablet ? 0.78 : 0.9,
      shardSpread: isMobile ? 0.62 : isTablet ? 0.76 : 0.9,
      cameraZ: isMobile ? 6.4 : isTablet ? 5.9 : 5.4,
      cameraTravel: isMobile ? 1.55 : isTablet ? 1.95 : 2.4,
      cameraY: isMobile ? 0.34 : isTablet ? 0.48 : 0.6,
      fov: isMobile ? 54 : isTablet ? 49 : 45,
      sparkleCount: isMobile ? 42 : isTablet ? 58 : 80,
      sparkleScale: isMobile ? 5.2 : isTablet ? 6 : 7,
    }
    camera.fov = config.fov
    camera.updateProjectionMatrix()
    return config
  }, [camera, size.width])
}

function Shards({ progressRef, spread = 1 }) {
  const group = useRef()
  const shards = useShardData()

  useFrame((state, delta) => {
    const p = progressRef.current
    if (!group.current) return
    group.current.children.forEach((mesh, i) => {
      const s = shards[i]
      const dist = (1.4 + p * (3.2 * s.speed + 1.4)) * spread
      const target = s.dir.clone().multiplyScalar(dist)
      mesh.position.lerp(target, 0.15)
      mesh.rotation.x += delta * s.spin
      mesh.rotation.y += delta * s.spin * 0.7
      const sc = s.scale * (1 + p * 0.6)
      mesh.scale.setScalar(sc)
    })
  })

  return (
    <group ref={group}>
      {shards.map((s, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.5}
            roughness={0.25}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function Core({ progressRef }) {
  const core = useRef()
  const wire = useRef()

  useFrame((state, delta) => {
    const p = progressRef.current
    if (core.current) {
      core.current.rotation.y += delta * 0.25
      core.current.rotation.x += delta * 0.08
      const sc = 1 - Math.min(0.55, p * 0.6)
      core.current.scale.setScalar(sc)
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.15
      wire.current.rotation.z += delta * 0.05
    }
  })

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.15, 4]} />
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#ed1d24"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.6}
          distort={0.35}
          speed={1.6}
        />
      </mesh>
      <mesh ref={wire} scale={1.55}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function Rig({ progressRef, config }) {
  useFrame((state) => {
    const p = progressRef.current
    state.camera.position.z = config.cameraZ - p * config.cameraTravel
    state.camera.position.y = p * config.cameraY
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function SceneContent({ progressRef }) {
  const config = useResponsiveConfig()
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 4]} intensity={2} color="#ed1d24" />
      <pointLight position={[-4, -2, -3]} intensity={1.3} color="#ffffff" />
      <Rig progressRef={progressRef} config={config} />
      <group scale={config.sceneScale}>
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
          <Core progressRef={progressRef} />
        </Float>
        <Shards progressRef={progressRef} spread={config.shardSpread} />
        <Sparkles count={config.sparkleCount} scale={config.sparkleScale} size={2} speed={0.25} color="#ffffff" opacity={0.35} />
      </group>
    </>
  )
}

export default function HomeScene({ progressRef }) {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <SceneContent progressRef={progressRef} />
    </Canvas>
  )
}
