'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// Define node positions for the neural network
const NODE_DATA: { pos: [number, number, number]; radius: number; color: string }[] = [
  // Cyan nodes
  { pos: [-2.5, 1.2, -1], radius: 0.12, color: '#00C9FF' },
  { pos: [-1.8, -0.5, 0.5], radius: 0.08, color: '#00C9FF' },
  { pos: [-1.0, 1.8, -0.5], radius: 0.1, color: '#00C9FF' },
  { pos: [-0.3, -1.5, 0.8], radius: 0.06, color: '#00C9FF' },
  { pos: [0.5, 0.8, -1.2], radius: 0.15, color: '#00C9FF' },
  { pos: [1.2, -0.9, 0.3], radius: 0.09, color: '#00C9FF' },
  { pos: [2.0, 1.5, -0.3], radius: 0.07, color: '#00C9FF' },
  { pos: [2.5, -0.2, -0.8], radius: 0.11, color: '#00C9FF' },
  // Purple nodes
  { pos: [-2.0, 0.3, 0.8], radius: 0.1, color: '#7B61FF' },
  { pos: [-0.8, -0.8, -0.7], radius: 0.07, color: '#7B61FF' },
  { pos: [0.2, 1.5, 0.6], radius: 0.13, color: '#7B61FF' },
  { pos: [1.5, 0.2, 1.0], radius: 0.08, color: '#7B61FF' },
  { pos: [-1.5, 1.0, 1.2], radius: 0.06, color: '#7B61FF' },
  // Gold highlight nodes
  { pos: [-0.5, 0.5, 0.2], radius: 0.14, color: '#FFB800' },
  { pos: [0.8, -1.2, -0.5], radius: 0.1, color: '#FFB800' },
  { pos: [1.8, 0.8, 0.5], radius: 0.05, color: '#FFB800' },
  // Extra scatter
  { pos: [-2.2, -1.3, -0.3], radius: 0.07, color: '#00C9FF' },
  { pos: [2.3, -1.4, 0.6], radius: 0.09, color: '#7B61FF' },
]

// Define connections between nodes (indices)
const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [0, 8], [1, 3], [1, 9],
  [2, 4], [2, 10], [3, 9], [3, 14],
  [4, 5], [4, 10], [4, 13], [5, 6], [5, 11],
  [6, 7], [6, 15], [7, 11], [8, 12],
  [8, 1], [9, 13], [10, 12], [10, 13],
  [11, 15], [12, 13], [13, 14], [14, 5],
  [15, 7], [16, 0], [16, 1], [16, 3],
  [17, 7], [17, 5], [17, 14],
]

function NetworkNode({ position, radius, color }: { position: [number, number, number]; radius: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Outer glow */}
      <mesh position={position}>
        <sphereGeometry args={[radius * 1.8, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
        />
      </mesh>
    </Float>
  )
}

function ConnectionLines() {
  const ref = useRef<THREE.Group>(null)

  const lineGeometries = useMemo(() => {
    return CONNECTIONS.map(([a, b]) => {
      const start = new THREE.Vector3(...NODE_DATA[a].pos)
      const end = new THREE.Vector3(...NODE_DATA[b].pos)
      const points = [start, end]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      return geometry
    })
  }, [])

  return (
    <group ref={ref}>
      {lineGeometries.map((geometry, i) => (
        <line key={i} geometry={geometry}>
          <lineBasicMaterial color="#7B61FF" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  )
}

// Small bright spheres that travel along connections
function Pulses() {
  const count = 8
  const ref = useRef<THREE.InstancedMesh>(null)

  // Each pulse: which connection, progress (0-1), speed
  const pulseData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      connectionIndex: i % CONNECTIONS.length,
      progress: Math.random(),
      speed: 0.15 + Math.random() * 0.2,
    }))
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    if (!ref.current) return

    pulseData.forEach((pulse, i) => {
      pulse.progress += pulse.speed * delta
      if (pulse.progress > 1) {
        pulse.progress = 0
        pulse.connectionIndex = (pulse.connectionIndex + 3) % CONNECTIONS.length
      }

      const [a, b] = CONNECTIONS[pulse.connectionIndex]
      const start = new THREE.Vector3(...NODE_DATA[a].pos)
      const end = new THREE.Vector3(...NODE_DATA[b].pos)
      const pos = start.lerp(end, pulse.progress)

      dummy.position.copy(pos)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
    })

    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#00C9FF" transparent opacity={0.9} />
    </instancedMesh>
  )
}

function NetworkGroup() {
  const groupRef = useRef<THREE.Group>(null)

  // Slow overall rotation
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
  })

  return (
    <group ref={groupRef}>
      {NODE_DATA.map((node, i) => (
        <NetworkNode key={i} position={node.pos} radius={node.radius} color={node.color} />
      ))}
      <ConnectionLines />
      <Pulses />
    </group>
  )
}

export function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#00C9FF" />
      <pointLight position={[-5, -3, 3]} intensity={0.2} color="#7B61FF" />
      <NetworkGroup />
    </>
  )
}
