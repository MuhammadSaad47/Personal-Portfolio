'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Line, Text } from '@react-three/drei'
import * as THREE from 'three'

// Circuit trace component
function CircuitTrace({ start, end, color = '#00C9FF' }: { start: [number, number, number]; end: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Line>(null)
  const progress = useRef(0)
  
  useFrame((_, delta) => {
    if (ref.current) {
      progress.current = (progress.current + delta * 0.5) % 1
      const material = ref.current.material as THREE.LineBasicMaterial
      material.opacity = 0.3 + Math.sin(progress.current * Math.PI * 2) * 0.2
    }
  })
  
  return (
    <Line
      ref={ref}
      points={[start, end]}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.5}
    />
  )
}

// Glowing chip component
function Chip({ position, size = [1, 0.1, 0.6], color = '#00C9FF' }: { position: [number, number, number]; size?: [number, number, number]; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5 + 0.5
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.1 + pulse * 0.15
    }
  })
  
  return (
    <group position={position}>
      {/* Main chip body */}
      <mesh ref={meshRef}>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#0a1628" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glow effect */}
      <mesh ref={glowRef} scale={[1.1, 1.5, 1.1]}>
        <boxGeometry args={size} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      {/* Pin markers */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
        <mesh key={i} position={[x * size[0], 0, size[2] * 0.6]}>
          <boxGeometry args={[0.05, 0.02, 0.1]} />
          <meshStandardMaterial color="#FFB800" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// FPGA 3D Chip Component
function FPGAChip3D({ position }: { position: [number, number, number] }) {
  const coreRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })

  return (
    <group position={position}>
      {/* Substrate */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#0f2b48" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Silicon Die */}
      <mesh ref={coreRef} position={[0, 0.12, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.6]} />
        <meshStandardMaterial color="#00C9FF" emissive="#00C9FF" emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Heat spreader frame */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[1.2, 0.04, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Pins around FPGA */}
      {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((x, idx) => (
        <group key={idx}>
          <mesh position={[x, 0.08, 0.8]}>
            <boxGeometry args={[0.08, 0.12, 0.08]} />
            <meshStandardMaterial color="#FFB800" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[x, 0.08, -0.8]}>
            <boxGeometry args={[0.08, 0.12, 0.08]} />
            <meshStandardMaterial color="#FFB800" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Arduino 3D Board Component
function ArduinoBoard3D({ position }: { position: [number, number, number] }) {
  const rxTxRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (rxTxRef.current) {
      const material = rxTxRef.current.material as THREE.MeshBasicMaterial
      material.opacity = Math.random() > 0.7 ? 0.9 : 0.2
    }
  })

  return (
    <group position={position} rotation={[0, -Math.PI / 6, 0]}>
      {/* Arduino PCB base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.4, 0.08, 2.0]} />
        <meshStandardMaterial color="#005C53" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* USB Port (metallic) */}
      <mesh position={[-0.4, 0.14, -0.9]}>
        <boxGeometry args={[0.35, 0.2, 0.45]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Power Jack */}
      <mesh position={[0.4, 0.18, -0.8]}>
        <boxGeometry args={[0.4, 0.25, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Main MCU (ATmega328P) */}
      <mesh position={[0, 0.1, 0.35]}>
        <boxGeometry args={[0.35, 0.08, 1.0]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Header sockets (black blocks) */}
      <mesh position={[-0.6, 0.12, 0.15]}>
        <boxGeometry args={[0.1, 0.16, 1.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 0.12, 0.15]}>
        <boxGeometry args={[0.1, 0.16, 1.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Flashing status LEDs */}
      <mesh position={[-0.35, 0.09, 0.7]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>
      <mesh ref={rxTxRef} position={[-0.35, 0.09, 0.55]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#f87171" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// PCB Board component
function PCBBoard() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05 + 0.1
    }
  })
  
  const traces = useMemo(() => {
    const result: { start: [number, number, number]; end: [number, number, number]; color: string }[] = []
    for (let i = 0; i < 30; i++) {
      const x1 = (Math.random() - 0.5) * 8
      const z1 = (Math.random() - 0.5) * 5
      const x2 = x1 + (Math.random() - 0.5) * 3
      const z2 = z1 + (Math.random() - 0.5) * 2
      result.push({
        start: [x1, 0.06, z1],
        end: [x2, 0.06, z2],
        color: Math.random() > 0.7 ? '#7B61FF' : '#00C9FF'
      })
    }
    return result
  }, [])
  
  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* Main PCB board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial 
          color="#0a1628" 
          metalness={0.3} 
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Circuit traces */}
      {traces.map((trace, i) => (
        <CircuitTrace key={i} start={trace.start} end={trace.end} color={trace.color} />
      ))}
      
      {/* Detailed custom 3D models directly on PCB */}
      <FPGAChip3D position={[-2.2, 0, -0.6]} />
      <ArduinoBoard3D position={[2.2, 0, 0.4]} />
      
      {/* Mini chips */}
      <Chip position={[-1, 0.1, 1.8]} size={[0.8, 0.08, 0.5]} />
      <Chip position={[0.5, 0.1, -1.8]} size={[0.6, 0.08, 0.4]} />
      
      {/* Via holes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={`via-${i}`} 
          position={[(Math.random() - 0.5) * 8, 0.01, (Math.random() - 0.5) * 5]}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial color="#FFB800" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// Floating IoT node
function IoTNode({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime + delay
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3
      groupRef.current.rotation.y = t * 0.2
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.08, 0.25]} />
        <meshStandardMaterial color="#0a1628" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0.15, 0.1, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
        <meshStandardMaterial color="#00C9FF" emissive="#00C9FF" emissiveIntensity={0.5} />
      </mesh>
      {/* LED indicator */}
      <mesh position={[-0.12, 0.05, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#00C9FF" />
      </mesh>
    </group>
  )
}

// Floating binary particles
function BinaryParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const { positions, chars } = useMemo(() => {
    const count = 50
    const positions = new Float32Array(count * 3)
    const chars: string[] = []
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = Math.random() * 10 - 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
      chars.push(Math.random() > 0.5 ? '1' : '0')
    }
    
    return { positions, chars }
  }, [])
  
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < posArray.length / 3; i++) {
        posArray[i * 3 + 1] += delta * 0.2
        if (posArray[i * 3 + 1] > 8) {
          posArray[i * 3 + 1] = -2
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00C9FF"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

// Data stream lines between nodes
function DataStream({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const lineRef = useRef<THREE.Line>(null)
  
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineDashedMaterial
      material.dashOffset = -state.clock.elapsedTime * 2
    }
  })
  
  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color="#00C9FF"
      lineWidth={1}
      dashed
      dashScale={10}
      dashSize={0.5}
      dashOffset={0}
      transparent
      opacity={0.4}
    />
  )
}

// Holographic Computer Architecture Pipeline Stages (RISC-V)
function RISCVPipeline3D({ position }: { position: [number, number, number] }) {
  const stages = ["IF", "ID", "EX", "MEM", "WB"]
  
  return (
    <group position={position}>
      {stages.map((stage, idx) => {
        const offsetZ = (idx - 2) * 1.1
        
        return (
          <Float key={stage} speed={1.2 + idx * 0.2} floatIntensity={0.2} rotationIntensity={0.02}>
            <group position={[0, 0.4 + Math.sin(idx) * 0.1, offsetZ]}>
              {/* Stage Box */}
              <mesh>
                <boxGeometry args={[0.7, 0.3, 0.5]} />
                <meshStandardMaterial 
                  color={idx === 2 ? "#FFB800" : "#7B61FF"} 
                  emissive={idx === 2 ? "#FFB800" : "#7B61FF"}
                  emissiveIntensity={0.3}
                  transparent 
                  opacity={0.7}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Core glow */}
              <mesh scale={[1.1, 1.1, 1.1]}>
                <boxGeometry args={[0.7, 0.3, 0.5]} />
                <meshBasicMaterial 
                  color={idx === 2 ? "#FFB800" : "#7B61FF"} 
                  transparent 
                  opacity={0.15} 
                />
              </mesh>
              
              {/* Connecting bus line between stages */}
              {idx < stages.length - 1 && (
                <mesh position={[0, 0, 0.8]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
                  <meshBasicMaterial color="#00C9FF" />
                </mesh>
              )}
            </group>
          </Float>
        )
      })}
    </group>
  )
}

// Scene content
function SceneContent({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(0, 3, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  if (reducedMotion) {
    return (
      <>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00C9FF" />
        <PCBBoard />
      </>
    )
  }
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00C9FF" />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#7B61FF" />
      
      <PCBBoard />
      
      {/* Floating RISC-V Pipeline stages */}
      <RISCVPipeline3D position={[0, 0.6, -4.5]} />
      
      {/* IoT Nodes */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <IoTNode position={[-4, 2, 1]} delay={0} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <IoTNode position={[4, 2.5, 0]} delay={1} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <IoTNode position={[0, 3, 2]} delay={2} />
      </Float>
      
      {/* Data streams */}
      <DataStream start={[-4, 2, 1]} end={[0, 0, -2]} />
      <DataStream start={[4, 2.5, 0]} end={[0, 0, -2]} />
      <DataStream start={[0, 3, 2]} end={[0, 0, -2]} />
      
      <BinaryParticles />
    </>
  )
}

// Main component
export function Scene3DBackground() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)
  
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    
    // Check for low-end device
    const cores = navigator.hardwareConcurrency || 4
    setIsLowEnd(cores < 4)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  if (isLowEnd) {
    return <FallbackBackground />
  }
  
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [0, 3, 8], fov: 50 }}
      >
        <SceneContent reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}

// Fallback for low-end devices
function FallbackBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 L90 10 L90 50 M10 50 L50 50 L50 90 M70 50 L70 90" 
                  stroke="#00C9FF" strokeWidth="1" fill="none" opacity="0.3">
              <animate attributeName="stroke-dashoffset" from="200" to="0" dur="4s" repeatCount="indefinite"/>
            </path>
            <circle cx="10" cy="10" r="3" fill="#00C9FF" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="90" cy="50" r="3" fill="#7B61FF" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <rect x="45" y="85" width="10" height="10" fill="#FFB800" opacity="0.3">
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite"/>
            </rect>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)"/>
      </svg>
    </div>
  )
}

export default Scene3DBackground
