"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  connections: number[]
  pulse: number
  pulseSpeed: number
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const scrollRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 25000), 80)
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 2,
        opacity: 0.15 + Math.random() * 0.35,
        hue: Math.random() > 0.7 ? 270 : Math.random() > 0.4 ? 190 : 42, // purple, cyan, or gold
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
      })
    }

    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = document.documentElement.scrollHeight
      canvas.width = width
      canvas.height = window.innerHeight
      initParticles(width, window.innerHeight)
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouse)

    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    const getScrollColor = (baseHue: number) => {
      const scrollFraction = scrollRef.current / Math.max(1, height - window.innerHeight)
      // Shift hue based on scroll: cyan at top → purple middle → gold bottom
      const shift = scrollFraction * 80
      return (baseHue + shift) % 360
    }

    const animate = () => {
      const particles = particlesRef.current
      const canvasHeight = canvas.height

      ctx.clearRect(0, 0, width, canvasHeight)

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.pulse += p.pulseSpeed

        // Gentle drift
        p.x += p.vx
        p.y += p.vy

        // Mouse repulsion (gentle)
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.5
          p.vx += (dx / dist) * force * 0.1
          p.vy += (dy / dist) * force * 0.1
        }

        // Velocity damping
        p.vx *= 0.99
        p.vy *= 0.99

        // Boundary wrap
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = canvasHeight + 10
        if (p.y > canvasHeight + 10) p.y = -10

        const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.1
        const hue = getScrollColor(p.hue)

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cdx = p.x - p2.x
          const cdy = p.y - p2.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)

          if (cdist < 180) {
            const lineOpacity = (1 - cdist / 180) * 0.12
            const midHue = (hue + getScrollColor(p2.hue)) / 2
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsla(${midHue}, 85%, 60%, ${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        gradient.addColorStop(0, `hsla(${hue}, 85%, 60%, ${pulseOpacity * 0.3})`)
        gradient.addColorStop(1, `hsla(${hue}, 85%, 60%, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + Math.sin(p.pulse) * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 85%, 65%, ${pulseOpacity})`
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouse)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.18 }}
    />
  )
}
