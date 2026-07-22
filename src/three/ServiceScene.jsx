import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { RoundedBox, Sparkles, Text } from '@react-three/drei'
import * as THREE from 'three'

const GLASS_COLOR = '#dfefff'
const GLASS_ACCENT = '#bfe7ff'
const COLORS = [GLASS_COLOR, GLASS_COLOR, GLASS_COLOR, GLASS_COLOR, GLASS_COLOR, GLASS_COLOR]
const ACCENTS = [GLASS_ACCENT, GLASS_ACCENT, GLASS_ACCENT, GLASS_ACCENT, GLASS_ACCENT, GLASS_ACCENT]
const DEFAULT_SERVICES = [
  { tag: 'Paid Social', title: 'Social Ads', accent: GLASS_ACCENT, img: 'https://picsum.photos/seed/service-paid-social/400/400' },
  { tag: 'Performance', title: 'Search ROI', accent: GLASS_ACCENT, img: 'https://picsum.photos/seed/service-performance/400/400' },
  { tag: 'Creative', title: 'Ad Design', accent: GLASS_ACCENT, img: 'https://picsum.photos/seed/service-creative/400/400' },
  { tag: 'Motion', title: 'Video Cuts', accent: GLASS_ACCENT, img: 'https://picsum.photos/seed/service-motion/400/400' },
  { tag: 'Partners', title: 'Creators', accent: GLASS_ACCENT, img: 'https://picsum.photos/seed/service-partnerships/400/400' },
  { tag: 'Growth', title: 'Analytics', accent: GLASS_ACCENT, img: 'https://picsum.photos/seed/service-growth/400/400' },
]

function createFallbackTexture(service, index) {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = 320
  canvas.height = 220
  const ctx = canvas.getContext('2d')
  const accent = service.accent || ACCENTS[index % ACCENTS.length]
  const gradient = ctx.createLinearGradient(0, 0, 320, 220)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
  gradient.addColorStop(1, 'rgba(191, 231, 255, 0.36)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 320, 220)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
  ctx.fillRect(26, 26, 268, 168)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  ctx.fillRect(52, 54, 112, 72)
  ctx.fillStyle = accent
  ctx.fillRect(178, 62, 88, 10)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.58)'
  ctx.fillRect(178, 88, 64, 10)
  ctx.fillRect(52, 150, 214, 12)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function useResponsiveConfig() {
  const { size, camera } = useThree()
  return useMemo(() => {
    const width = size.width || 1200
    const isMobile = width < 640
    const isTablet = width >= 640 && width < 1024
    const config = {
      sceneScale: isMobile ? 0.72 : isTablet ? 0.86 : 1,
      radius: isMobile ? 1.95 : isTablet ? 2.15 : 2.4,
      cameraZ: isMobile ? 7.1 : isTablet ? 6.8 : 6.4,
      cameraY: isMobile ? 0.28 : 0.4,
      cameraDrift: isMobile ? 0.14 : isTablet ? 0.22 : 0.3,
      fov: isMobile ? 50 : isTablet ? 46 : 42,
      sparkleCount: isMobile ? 32 : isTablet ? 46 : 60,
      sparkleScale: isMobile ? 4.6 : isTablet ? 5.3 : 6,
    }
    camera.fov = config.fov
    camera.updateProjectionMatrix()
    return config
  }, [camera, size.width])
}

function Carousel({ progressRef, services, radius = 2.4 }) {
  const group = useRef()
  const imageUrls = useMemo(() => services.map((service) => service.img), [services])
  const imageTextures = useLoader(THREE.TextureLoader, imageUrls, (loader) => {
    loader.setCrossOrigin('anonymous')
  })

  useEffect(() => {
    imageTextures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
    })
  }, [imageTextures])

  const panels = useMemo(
    () => {
      const items = services.map((item, i) => {
        const service = {
          ...item,
          accent: item.accent || ACCENTS[i % ACCENTS.length],
        }
        return {
          angle: (i / services.length) * Math.PI * 2,
          color: COLORS[i % COLORS.length],
          service,
          fallbackTexture: createFallbackTexture(service, i),
        }
      })
      return items
    },
    [services]
  )

  useFrame((state, delta) => {
    if (!group.current) return
    const p = progressRef.current
    const targetY = -p * Math.PI * 2
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08
    group.current.rotation.x = Math.sin(p * Math.PI) * 0.08
  })

  return (
    <group ref={group}>
      {panels.map((panel, i) => (
        <group
          key={i}
          rotation={[0, panel.angle, 0]}
        >
          <RoundedBox
            args={[1.5, 2, 0.12]}
            radius={0.12}
            smoothness={4}
            position={[0, 0, radius]}
          >
            <meshPhysicalMaterial
              color={panel.color}
              emissive={GLASS_ACCENT}
              emissiveIntensity={0.08}
              roughness={0.05}
              metalness={0}
              transparent
              opacity={0.12}
              transmission={0.92}
              thickness={0.58}
              clearcoat={1}
              clearcoatRoughness={0.06}
              ior={1.38}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </RoundedBox>
          <group position={[0, 0, radius + 0.075]}>
            <mesh position={[0, 0.44, 0.01]}>
              <planeGeometry args={[1.12, 0.62]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
            <mesh position={[0, 0.44, 0.02]}>
              <planeGeometry args={[1, 0.52]} />
              <meshBasicMaterial
                color="#ffffff"
                map={imageTextures[i] || panel.fallbackTexture}
                transparent
                opacity={0.86}
              />
            </mesh>
            <Text
              position={[0, -0.24, 0.035]}
              fontSize={0.115}
              maxWidth={1.16}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color="#ffffff"
            >
              {panel.service.title}
            </Text>
            <Text
              position={[0, -0.53, 0.035]}
              fontSize={0.075}
              letterSpacing={0.06}
              maxWidth={1.1}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color="#b7b7b7"
            >
              {panel.service.tag}
            </Text>
          </group>
        </group>
      ))}
    </group>
  )
}

function Rig({ progressRef, config }) {
  useFrame((state) => {
    const p = progressRef.current
    state.camera.position.z = config.cameraZ
    state.camera.position.y = config.cameraY - p * 0.15
    state.camera.position.x = Math.sin(p * Math.PI * 2) * config.cameraDrift
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function SceneContent({ progressRef, services }) {
  const config = useResponsiveConfig()
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 5]} intensity={1.35} color={GLASS_ACCENT} />
      <pointLight position={[-4, -3, -4]} intensity={1.4} color="#ffffff" />
      <Rig progressRef={progressRef} config={config} />
      <group scale={config.sceneScale}>
        <Carousel progressRef={progressRef} services={services} radius={config.radius} />
        <Sparkles count={config.sparkleCount} scale={config.sparkleScale} size={2} speed={0.2} color="#ffffff" opacity={0.3} />
      </group>
    </>
  )
}

export default function ServiceScene({ progressRef, services = DEFAULT_SERVICES }) {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0.4, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <SceneContent progressRef={progressRef} services={services} />
    </Canvas>
  )
}
