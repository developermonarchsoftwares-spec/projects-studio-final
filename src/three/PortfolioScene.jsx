import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { RoundedBox, Line, Text } from '@react-three/drei'
import * as THREE from 'three'

const GLASS_COLOR = '#dfefff'
const GLASS_ACCENT = '#bfe7ff'
const COLORS = [GLASS_COLOR, GLASS_COLOR, GLASS_COLOR, GLASS_COLOR]
const SPACING = 6
const DEFAULT_PROJECTS = [
  { title: 'Orbit Foods', cat: 'Paid Social', metric: '+184% CTR', year: '2026', img: 'https://picsum.photos/seed/orbit-foods-work/800/600' },
  { title: 'Haus & Co', cat: 'Brand Film', metric: '2.1M views', year: '2025', img: 'https://picsum.photos/seed/haus-co-work/800/600' },
  { title: 'Pulse Fit', cat: 'Performance', metric: '4.6x ROAS', year: '2025', img: 'https://picsum.photos/seed/pulse-fit-work/800/600' },
]

function createFallbackTexture(project, index, color) {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = 480
  canvas.height = 300
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 480, 300)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
  gradient.addColorStop(1, 'rgba(191, 231, 255, 0.36)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 480, 300)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.fillRect(0, 0, 480, 300)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  ctx.fillRect(42, 48, 170, 116)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(340, 108, 58, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.62)'
  ctx.fillRect(42, 204, 330, 14)
  ctx.fillRect(42, 234, 220, 14)

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
      sideOffset: isMobile ? 1.18 : isTablet ? 1.48 : 1.85,
      yWave: isMobile ? 0.26 : isTablet ? 0.32 : 0.4,
      spacing: isMobile ? 5.1 : isTablet ? 5.5 : SPACING,
      cameraX: isMobile ? 0.18 : isTablet ? 0.32 : 0.5,
      cameraY: isMobile ? 0.46 : isTablet ? 0.38 : 0.3,
      lookAhead: isMobile ? 5.1 : isTablet ? 5.5 : 6,
      fov: isMobile ? 58 : isTablet ? 54 : 50,
      gridWidth: isMobile ? 6.2 : isTablet ? 7 : 8,
      fadeDistance: isMobile ? 15 : isTablet ? 16 : 18,
    }
    camera.fov = config.fov
    camera.updateProjectionMatrix()
    return config
  }, [camera, size.width])
}

function useLayout(projects, config) {
  return useMemo(() => {
    return projects.map((project, i) => {
      const side = i % 2 === 0 ? 1 : -1
      const color = COLORS[i % COLORS.length]
      const isFirst = i === 0
      return {
        position: [
          isFirst ? 0 : side * config.sideOffset,
          Math.sin(i * 1.3) * config.yWave,
          isFirst ? -config.spacing * 0.4 : -i * config.spacing,
        ],
        rotationY: isFirst ? 0 : side * -0.5,
        color,
        project,
        fallbackTexture: createFallbackTexture(project, i, color),
      }
    })
  }, [config, projects])
}

const IMAGE_FRAME_WIDTH = 2.16
const IMAGE_FRAME_HEIGHT = 0.82

function getContainSize(texture, maxWidth, maxHeight) {
  const image = texture?.image
  const naturalWidth = image?.naturalWidth || image?.width
  const naturalHeight = image?.naturalHeight || image?.height
  const imageAspect = naturalWidth && naturalHeight ? naturalWidth / naturalHeight : maxWidth / maxHeight
  const frameAspect = maxWidth / maxHeight

  if (imageAspect > frameAspect) {
    return { width: maxWidth, height: maxWidth / imageAspect }
  }
  return { width: maxHeight * imageAspect, height: maxHeight }
}

function Billboards({ layout }) {
  const imageUrls = useMemo(() => layout.map((item) => item.project.img), [layout])
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

  const frameSizes = useMemo(
    () =>
      layout.map((item, i) =>
        getContainSize(imageTextures[i] || item.fallbackTexture, IMAGE_FRAME_WIDTH, IMAGE_FRAME_HEIGHT)
      ),
    [layout, imageTextures]
  )

  return (
    <>
      {layout.map((item, i) => (
        <group key={i} position={item.position} rotation={[0, item.rotationY, 0]}>
          <RoundedBox args={[2.6, 1.6, 0.1]} radius={0.08} smoothness={4}>
            <meshPhysicalMaterial
              color={item.color}
              emissive={GLASS_ACCENT}
              emissiveIntensity={0.08}
              roughness={0.05}
              metalness={0}
              transparent
              opacity={0.18}
              transmission={0.82}
              thickness={0.82}
              clearcoat={1}
              clearcoatRoughness={0.06}
              ior={1.38}
            />
          </RoundedBox>
          <group position={[0, 0, 0.065]}>
            <mesh position={[0, 0.34, 0.01]}>
              <planeGeometry args={[IMAGE_FRAME_WIDTH, IMAGE_FRAME_HEIGHT]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.88} />
            </mesh>
            <mesh position={[0, 0.34, 0.012]}>
              <planeGeometry args={[frameSizes[i].width, frameSizes[i].height]} />
              <meshBasicMaterial
                color="#ffffff"
                map={imageTextures[i] || item.fallbackTexture}
                transparent
                opacity={0.88}
              />
            </mesh>
            <Text
              position={[0, -0.27, 0.025]}
              fontSize={0.16}
              maxWidth={2.12}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color="#ffffff"
            >
              {item.project.title}
            </Text>
            <Text
              position={[0, -0.58, 0.025]}
              fontSize={0.075}
              letterSpacing={0.05}
              maxWidth={2}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color="#b7b7b7"
            >
              {`${item.project.cat} / ${item.project.year}`}
            </Text>
            <Text
              position={[0, -0.74, 0.025]}
              fontSize={0.095}
              maxWidth={1.8}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color={GLASS_ACCENT}
            >
              {item.project.metric}
            </Text>
          </group>
        </group>
      ))}
    </>
  )
}

function PathLine({ layout }) {
  const points = useMemo(
    () => layout.map((item) => new THREE.Vector3(0, -0.9, item.position[2])),
    [layout]
  )
  return <Line points={points} color="#ffffff" transparent opacity={0.25} lineWidth={1} />
}

function Rig({ progressRef, count, config }) {
  useFrame((state) => {
    const p = progressRef.current
    const depth = (count - 1) * config.spacing
    const z = 1.6 - p * depth * config.sceneScale
    state.camera.position.z += (z - state.camera.position.z) * 0.09
    state.camera.position.x = Math.sin(p * Math.PI * 4) * config.cameraX
    state.camera.position.y = config.cameraY + Math.sin(p * Math.PI * 3) * 0.15
    state.camera.lookAt(0, 0, state.camera.position.z - config.lookAhead)
  })
  return null
}

function SceneContent({ progressRef, projects }) {
  const config = useResponsiveConfig()
  const layout = useLayout(projects, config)
  const depth = (projects.length - 1) * config.spacing
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 4, 16]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 4, 0]} intensity={1.35} color={GLASS_ACCENT} />
      <pointLight position={[0, -4, -depth]} intensity={1.4} color="#ffffff" />
      <Rig progressRef={progressRef} count={projects.length} config={config} />
      <group scale={config.sceneScale}>
        <Billboards layout={layout} />
        <PathLine layout={layout} />
      </group>
    </>
  )
}

export default function PortfolioScene({ progressRef, projects = DEFAULT_PROJECTS }) {
  return (
    <Canvas
      dpr={[1, 1.4]}
      camera={{ position: [0, 0.3, 1.6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.55 }}
    >
      <SceneContent progressRef={progressRef} projects={projects} />
    </Canvas>
  )
}
