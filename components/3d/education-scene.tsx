'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// Square waveform built from connected box segments
function Waveform({
  position,
  color,
  segments = 12,
  speed = 1,
  amplitude = 0.3,
  delay = 0,
}: {
  position: [number, number, number]
  color: string
  segments?: number
  speed?: number
  amplitude?: number
  delay?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRefs = useRef<THREE.MeshStandardMaterial[]>([])

  // Build a square wave shape: alternating horizontal + vertical segments
  const segmentData = useMemo(() => {
    const data: { pos: [number, number, number]; scale: [number, number, number]; isVertical: boolean }[] = []
    let x = 0
    let y = 0
    const segWidth = 0.4
    const segHeight = amplitude

    for (let i = 0; i < segments; i++) {
      if (i % 2 === 0) {
        // Horizontal segment
        data.push({
          pos: [x + segWidth / 2, y, 0],
          scale: [segWidth, 0.04, 0.04],
          isVertical: false,
        })
        x += segWidth
      } else {
        // Vertical segment (up or down)
        const dir = Math.floor(i / 2) % 2 === 0 ? 1 : -1
        data.push({
          pos: [x, y + (dir * segHeight) / 2, 0],
          scale: [0.04, segHeight, 0.04],
          isVertical: true,
        })
        y += dir * segHeight
      }
    }
    return data
  }, [segments, amplitude])

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + delay
    materialRefs.current.forEach((mat, i) => {
      if (mat) {
        // Propagating glow effect
        const wave = Math.sin(t * 2 - i * 0.5)
        const intensity = Math.max(0, wave) * 0.6
        mat.emissiveIntensity = 0.1 + intensity
        mat.opacity = 0.3 + intensity * 0.5
      }
    })
  })

  return (
    <group position={position}>
      {segmentData.map((seg, i) => (
        <mesh key={i} position={seg.pos} scale={seg.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            ref={(ref) => {
              if (ref) materialRefs.current[i] = ref
            }}
            color={color}
            emissive={color}
            emissiveIntensity={0.1}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

// AND gate: rectangular box approximation
function AndGate({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={ref} position={position}>
        {/* Main body */}
        <mesh>
          <boxGeometry args={[0.35, 0.25, 0.08]} />
          <meshStandardMaterial
            color="#7B61FF"
            emissive="#7B61FF"
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Curved front approximation */}
        <mesh position={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.08, 8, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial
            color="#7B61FF"
            emissive="#7B61FF"
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Input pins */}
        <mesh position={[-0.22, 0.06, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#00C9FF" transparent opacity={0.4} />
        </mesh>
        <mesh position={[-0.22, -0.06, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#00C9FF" transparent opacity={0.4} />
        </mesh>
        {/* Output pin */}
        <mesh position={[0.32, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#FFB800" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

// OR gate: slightly rounded box
function OrGate({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.08
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={ref} position={position}>
        <mesh>
          <boxGeometry args={[0.35, 0.28, 0.08]} />
          <meshStandardMaterial
            color="#7B61FF"
            emissive="#7B61FF"
            emissiveIntensity={0.12}
            transparent
            opacity={0.45}
          />
        </mesh>
        {/* Rounded front */}
        <mesh position={[0.16, 0, 0]}>
          <sphereGeometry args={[0.14, 8, 8, 0, Math.PI, 0, Math.PI]} />
          <meshStandardMaterial
            color="#7B61FF"
            emissive="#7B61FF"
            emissiveIntensity={0.12}
            transparent
            opacity={0.45}
          />
        </mesh>
        {/* Pins */}
        <mesh position={[-0.22, 0.06, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#00C9FF" transparent opacity={0.4} />
        </mesh>
        <mesh position={[-0.22, -0.06, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#00C9FF" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#FFB800" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

// NOT gate: cone rotated sideways (triangle)
function NotGate({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + 2) * 0.12
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.04} floatIntensity={0.12}>
      <group ref={ref} position={position}>
        {/* Triangle body */}
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshStandardMaterial
            color="#7B61FF"
            emissive="#7B61FF"
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Inversion bubble */}
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#FFB800" transparent opacity={0.5} />
        </mesh>
        {/* Input pin */}
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#00C9FF" transparent opacity={0.4} />
        </mesh>
        {/* Output pin */}
        <mesh position={[0.28, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshBasicMaterial color="#FFB800" transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

// Register/Flip-Flop block: stack of thin boxes
function RegisterBlock({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Float speed={0.8} rotationIntensity={0.03} floatIntensity={0.08}>
      <group ref={ref} position={position}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, i * 0.07 - 0.1, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.25]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#00C9FF' : '#0a1628'}
              emissive={i % 2 === 0 ? '#00C9FF' : '#7B61FF'}
              emissiveIntensity={0.1}
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}
        {/* Edge connector pins */}
        {[-0.12, -0.04, 0.04, 0.12].map((z, i) => (
          <mesh key={`pin-${i}`} position={[-0.22, -0.05, z]}>
            <boxGeometry args={[0.06, 0.02, 0.02]} />
            <meshBasicMaterial color="#FFB800" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Digital clock signal: pulsing sphere
function ClockSignal({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3
      ref.current.scale.setScalar(pulse)
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 4) * 0.08
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.02} floatIntensity={0.15}>
      <group position={position}>
        {/* Core sphere */}
        <mesh ref={ref}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#FFB800"
            emissive="#FFB800"
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
        {/* Glow halo */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#FFB800" transparent opacity={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

export function EducationScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#00C9FF" />
      <pointLight position={[-10, -5, -10]} intensity={0.2} color="#7B61FF" />

      {/* Waveforms flowing horizontally */}
      <Waveform position={[-3.5, 2.2, -2]} color="#00C9FF" segments={14} speed={0.8} delay={0} />
      <Waveform position={[-3.0, 1.2, -3]} color="#00C9FF" segments={12} speed={1.0} delay={1} amplitude={0.25} />
      <Waveform position={[-2.5, -1.5, -2.5]} color="#00C9FF" segments={10} speed={0.6} delay={2} amplitude={0.35} />
      <Waveform position={[-3.2, -2.5, -2]} color="#00C9FF" segments={12} speed={0.9} delay={3} amplitude={0.2} />

      {/* Logic gates floating */}
      <AndGate position={[3.2, 1.8, -2]} />
      <OrGate position={[-3.0, 0.2, -1.5]} />
      <NotGate position={[2.8, -1.2, -2.5]} />

      {/* Register block */}
      <RegisterBlock position={[3.5, -2.2, -1.8]} />

      {/* Clock signal */}
      <ClockSignal position={[0, 2.8, -2]} />
      <ClockSignal position={[-2, -2.8, -1.5]} />
    </>
  )
}
