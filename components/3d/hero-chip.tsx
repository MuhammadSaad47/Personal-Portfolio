'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float } from '@react-three/drei'
import * as THREE from 'three'

function ChipModel() {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })
  
  // Pin positions
  const pins = []
  const pinCount = 8
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < pinCount; i++) {
      const offset = (i - (pinCount - 1) / 2) * 0.2
      let position: [number, number, number]
      let rotation: [number, number, number] = [0, 0, 0]
      
      switch (side) {
        case 0: // front
          position = [offset, 0, 0.85]
          break
        case 1: // back
          position = [offset, 0, -0.85]
          break
        case 2: // left
          position = [-0.85, 0, offset]
          rotation = [0, Math.PI / 2, 0]
          break
        case 3: // right
          position = [0.85, 0, offset]
          rotation = [0, Math.PI / 2, 0]
          break
        default:
          position = [0, 0, 0]
      }
      pins.push({ position, rotation })
    }
  }
  
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} scale={[1.3, 1.3, 1.3]}>
        {/* Main chip body */}
        <RoundedBox args={[1.5, 0.25, 1.5]} radius={0.05} smoothness={4}>
          <meshStandardMaterial 
            color="#0a1628" 
            metalness={0.8} 
            roughness={0.2}
          />
        </RoundedBox>
        
        {/* Top surface with circuit pattern */}
        <mesh position={[0, 0.13, 0]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshStandardMaterial 
            color="#040D18" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Center die */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.6, 0.05, 0.6]} />
          <meshStandardMaterial 
            color="#7B61FF" 
            emissive="#7B61FF"
            emissiveIntensity={0.3}
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Glow effect */}
        <mesh ref={glowRef} position={[0, 0, 0]} scale={[1.2, 1.5, 1.2]}>
          <boxGeometry args={[1.5, 0.25, 1.5]} />
          <meshBasicMaterial color="#00C9FF" transparent opacity={0.15} />
        </mesh>
        
        {/* Pins */}
        {pins.map((pin, i) => (
          <group key={i} position={pin.position} rotation={pin.rotation}>
            <mesh>
              <boxGeometry args={[0.08, 0.03, 0.2]} />
              <meshStandardMaterial 
                color="#FFB800" 
                metalness={0.95} 
                roughness={0.05}
              />
            </mesh>
          </group>
        ))}
        
        {/* Corner markers */}
        {[[-0.6, 0.14, -0.6], [0.6, 0.14, -0.6], [-0.6, 0.14, 0.6], [0.6, 0.14, 0.6]].map((pos, i) => (
          <mesh key={`corner-${i}`} position={pos as [number, number, number]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color="#00C9FF" />
          </mesh>
        ))}
        
        {/* Trace lines on surface */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`trace-h-${i}`} position={[0, 0.14, (i - 2) * 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 0.01]} />
            <meshBasicMaterial color="#00C9FF" transparent opacity={0.3} />
          </mesh>
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`trace-v-${i}`} position={[(i - 2) * 0.2, 0.14, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[1.2, 0.01]} />
            <meshBasicMaterial color="#00C9FF" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// 3D Floating Resistor hardware component
function FloatingResistor({ position, rotation, delay = 0 }: { position: [number, number, number]; rotation: [number, number, number]; delay?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay
      ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15
      ref.current.rotation.x = rotation[0] + t * 0.1
      ref.current.rotation.y = rotation[1] + t * 0.15
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Resistor body */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.35, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Colored stripes */}
      {[-0.1, 0, 0.1].map((x, idx) => (
        <mesh key={idx} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.04, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshBasicMaterial color={idx === 0 ? "#FFB800" : idx === 1 ? "#7B61FF" : "#00C9FF"} />
        </mesh>
      ))}
      {/* Connection wires */}
      <mesh position={[-0.25, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// 3D Floating Capacitor hardware component
function FloatingCapacitor({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + delay
      ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.12
      ref.current.rotation.y = t * 0.2
    }
  })

  return (
    <group ref={ref} position={position}>
      {/* Cylindrical base */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.28, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Golden Stripe */}
      <mesh position={[0.04, 0, 0]}>
        <cylinderGeometry args={[0.082, 0.082, 0.28, 8]} />
        <meshBasicMaterial color="#FFB800" transparent opacity={0.5} />
      </mesh>
      {/* Aluminum top */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.05} />
      </mesh>
    </group>
  )
}

export function HeroChip3D() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [2.2, 2.2, 2.2], fov: 40 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00C9FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#7B61FF" />
        <spotLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
        
        {/* Central Chip */}
        <ChipModel />
        
        {/* Floating Hardware parts */}
        <FloatingResistor position={[-2.4, 0.6, 0.2]} rotation={[0.2, 0.5, 0.4]} delay={0} />
        <FloatingResistor position={[2.4, -0.6, -0.2]} rotation={[-0.4, 0.2, 0.8]} delay={1.5} />
        <FloatingCapacitor position={[1.8, 0.8, -0.5]} delay={0.5} />
        <FloatingCapacitor position={[-1.8, -0.8, 0.6]} delay={2.0} />
        <FloatingResistor position={[0, 1.2, -1.2]} rotation={[0.3, -0.2, 0.5]} delay={0.8} />
        <FloatingCapacitor position={[0, -1.2, 0.8]} delay={2.5} />
      </Canvas>
    </div>
  )
}

export default HeroChip3D;
