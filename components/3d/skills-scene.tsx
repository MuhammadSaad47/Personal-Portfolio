'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RING_COLORS = [
  '#00C9FF', // Languages
  '#7B61FF', // Libraries
  '#FFB800', // Hardware
  '#00E5FF', // Domains
]

const RING_CONFIGS = [
  { radius: 1.6, tiltX: 0.3, tiltZ: 0.1, speed: 0.3, chipCount: 5 },
  { radius: 2.2, tiltX: -0.5, tiltZ: 0.3, speed: -0.2, chipCount: 6 },
  { radius: 2.8, tiltX: 0.15, tiltZ: -0.4, speed: 0.15, chipCount: 4 },
  { radius: 3.4, tiltX: -0.25, tiltZ: 0.2, speed: -0.25, chipCount: 7 },
]

function GlowingCore() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.2
    ref.current.rotation.x = state.clock.elapsedTime * 0.1
    const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05
    ref.current.scale.setScalar(scale)
  })

  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial
          color="#00C9FF"
          emissive="#00C9FF"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      {/* Inner solid core */}
      <mesh>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color="#00C9FF"
          emissive="#00C9FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#00C9FF" transparent opacity={0.06} />
      </mesh>
    </group>
  )
}

function OrbitalRing({ radius, tiltX, tiltZ, speed, chipCount, color }: {
  radius: number
  tiltX: number
  tiltZ: number
  speed: number
  chipCount: number
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const chipsRef = useRef<THREE.Group>(null)

  // Chip offsets evenly spaced around the ring
  const chipAngles = useMemo(() => {
    return Array.from({ length: chipCount }, (_, i) => (i / chipCount) * Math.PI * 2)
  }, [chipCount])

  useFrame((state) => {
    if (!groupRef.current || !chipsRef.current) return
    // Rotate the entire ring group for orbiting effect
    chipsRef.current.rotation.y = state.clock.elapsedTime * speed
  })

  return (
    <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
      {/* Ring path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* Orbiting chips */}
      <group ref={chipsRef}>
        {chipAngles.map((angle, i) => (
          <OrbitingChip
            key={i}
            baseAngle={angle}
            radius={radius}
            color={color}
            index={i}
          />
        ))}
      </group>
    </group>
  )
}

function OrbitingChip({ baseAngle, radius, color, index }: {
  baseAngle: number
  radius: number
  color: string
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    // Position on the ring
    const x = Math.cos(baseAngle) * radius
    const z = Math.sin(baseAngle) * radius
    ref.current.position.set(x, 0, z)
    // Self rotation
    ref.current.rotation.y = state.clock.elapsedTime * 0.5
    ref.current.rotation.z = state.clock.elapsedTime * 0.3 + index
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.1, 0.04, 0.1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function ScatteredParticles() {
  const count = 60
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00C9FF"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

export function SkillsScene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#00C9FF" />
      <pointLight position={[3, 2, -2]} intensity={0.2} color="#7B61FF" />
      <pointLight position={[-3, -2, 1]} intensity={0.15} color="#FFB800" />

      <GlowingCore />

      {RING_CONFIGS.map((config, i) => (
        <OrbitalRing
          key={i}
          radius={config.radius}
          tiltX={config.tiltX}
          tiltZ={config.tiltZ}
          speed={config.speed}
          chipCount={config.chipCount}
          color={RING_COLORS[i]}
        />
      ))}

      <ScatteredParticles />
    </>
  )
}
