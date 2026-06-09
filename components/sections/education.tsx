"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { GraduationCap, BookOpen, Cpu } from "lucide-react"

interface Education {
  id: string
  institution: string
  degree: string
  period: string
  status: string
  coursework: string[]
}

interface EducationProps {
  education: Education[]
}

// Animated timeline line that draws itself on scroll
function AnimatedTimelineLine({ isInView }: { isInView: boolean }) {
  const [lineLength, setLineLength] = useState(0)
  
  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => setLineLength(100), 300)
      return () => clearTimeout(timeout)
    }
  }, [isInView])
  
  return (
    <svg
      className="absolute left-0 md:left-1/2 top-0 h-full w-8 transform -translate-x-1/2 overflow-visible pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="timeline-gradient-edu" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00C9FF" />
          <stop offset="50%" stopColor="#7B61FF" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Main line */}
      <line
        x1="16"
        y1="0"
        x2="16"
        y2="100%"
        stroke="url(#timeline-gradient-edu)"
        strokeWidth="2"
        strokeDasharray="1000"
        strokeDashoffset={1000 - (lineLength * 10)}
        style={{ transition: 'stroke-dashoffset 2s ease-out' }}
      />
      {/* Circuit trace decoration */}
      <path
        d="M16 50 L24 50 L24 80 L16 80"
        stroke="#00C9FF"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        strokeDasharray="100"
        strokeDashoffset={isInView ? 0 : 100}
        style={{ transition: 'stroke-dashoffset 1s ease-out 0.5s' }}
      />
    </svg>
  )
}

// IC Chip timeline node
function ChipNode({ isActive, delay }: { isActive: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={isActive ? { scale: 1, rotate: 0 } : {}}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="absolute left-0 md:left-1/2 top-0 w-8 h-8 transform -translate-x-1/2 z-10"
    >
      <div className="relative w-full h-full">
        {/* Chip body */}
        <div className="absolute inset-1 rounded bg-[#0a1628] border border-[#00C9FF]/50">
          <Cpu className="w-full h-full p-1 text-[#00C9FF]" />
        </div>
        {/* Glow effect */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded blur-sm bg-[#00C9FF]/30"
        />
        {/* Pins */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-1 h-0.5 bg-[#FFB800]"
            style={{
              top: '50%',
              left: i < 2 ? '-2px' : 'auto',
              right: i >= 2 ? '-2px' : 'auto',
              transform: `translateY(${(i % 2 === 0 ? -4 : 4)}px)`
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export function Education({ education }: EducationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="education" className="py-20 lg:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C9FF]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[#00C9FF] font-mono text-sm mb-2 block">
              {"// Education"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Academic <span className="text-gradient">Background</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#FFB800] mx-auto rounded-full" />
          </div>

          {/* Timeline or Bento Grid */}
          {education.length === 1 ? (
            <div className="max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.01, y: -4 }}
                className="rounded-3xl glass p-8 md:p-12 relative overflow-hidden border border-[#00C9FF]/30 shadow-[0_0_50px_rgba(0,201,255,0.08)] hover:shadow-[0_0_60px_rgba(0,201,255,0.18)] transition-all duration-500"
              >
                {/* Circuit board corner decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <path d="M0 20 H50 L70 40 V100" stroke="#00C9FF" strokeWidth="1.5" />
                    <circle cx="50" cy="20" r="3" fill="#00C9FF" />
                    <circle cx="70" cy="60" r="3" fill="#FFB800" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <path d="M100 80 H50 L30 60 V0" stroke="#7B61FF" strokeWidth="1.5" />
                    <circle cx="50" cy="80" r="3" fill="#7B61FF" />
                  </svg>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                  {/* Left: Graphic Microprocessor Block */}
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative w-40 h-40 bg-[#0a1628] rounded-2xl border-2 border-[#00C9FF]/40 flex items-center justify-center glow-cyan">
                      <GraduationCap className="h-16 w-16 text-[#00C9FF] animate-pulse" />
                      {/* Silicon traces around edge */}
                      {Array.from({ length: 4 }).map((_, side) => (
                        <div key={side} className="absolute inset-0">
                          {Array.from({ length: 5 }).map((_, pinIdx) => {
                            const offset = (pinIdx - 2) * 20
                            return (
                              <span 
                                key={pinIdx}
                                className="absolute bg-[#FFB800] w-2 h-1 shadow-[0_0_5px_#FFB800]"
                                style={{
                                  top: side === 0 ? '-2px' : side === 1 ? 'auto' : `calc(50% + ${offset}px)`,
                                  bottom: side === 1 ? '-2px' : 'auto',
                                  left: side === 2 ? '-2px' : side === 3 ? 'auto' : `calc(50% + ${offset}px)`,
                                  right: side === 3 ? '-2px' : 'auto',
                                  transform: side === 0 || side === 1 ? 'translateX(-50%) rotate(90deg)' : 'translateY(-50%)'
                                }}
                              />
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono text-[#00C9FF] px-4 py-1.5 rounded-full glass border border-[#00C9FF]/30">
                        {education[0].period}
                      </span>
                      <span className="text-xs font-mono text-[#FFB800] px-4 py-1.5 rounded-full glass border border-[#FFB800]/30 animate-pulse">
                        {education[0].status}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-gradient">
                      {education[0].degree}
                    </h3>
                    
                    <p className="text-lg font-medium text-muted-foreground">
                      {education[0].institution}
                    </p>

                    <hr className="border-[#00C9FF]/20 my-4" />

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-[#00C9FF]" />
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider font-mono">
                          Core Specializations & Coursework
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {education[0].coursework.map((course, idx) => (
                          <span
                            key={course}
                            className="px-3 py-1.5 text-xs rounded-lg glass text-[#F0F4FF] border border-[#7B61FF]/30 hover:border-[#00C9FF] hover:shadow-[0_0_15px_rgba(0,201,255,0.3)] transition-all duration-300 cursor-pointer"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="relative max-w-3xl mx-auto">
              <AnimatedTimelineLine isInView={isInView} />

              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                  className={`relative pl-12 md:pl-0 pb-16 ${
                    index % 2 === 0 ? "md:pr-[calc(50%+2.5rem)]" : "md:pl-[calc(50%+2.5rem)]"
                  }`}
                >
                  <ChipNode isActive={isInView} delay={index * 0.3 + 0.2} />

                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-6 rounded-2xl glass hover:shadow-[0_0_30px_rgba(0,201,255,0.15)] transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-[#00C9FF]/10 shrink-0 border border-[#00C9FF]/20">
                        <GraduationCap className="h-6 w-6 text-[#00C9FF]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-[#00C9FF] px-3 py-1 rounded-full glass border-[#00C9FF]/30">
                            {edu.period}
                          </span>
                          <span className="text-xs font-medium text-[#FFB800] px-3 py-1 rounded-full glass border-[#FFB800]/30">
                            {edu.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-1 font-[family-name:var(--font-space-grotesk)]">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {edu.institution}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">
                            Key Coursework
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {edu.coursework.map((course, courseIndex) => (
                            <motion.span
                              key={course}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : {}}
                              transition={{ delay: index * 0.3 + courseIndex * 0.1 + 0.5 }}
                              className="px-3 py-1.5 text-xs rounded-full glass text-[#7B61FF] border-[#7B61FF]/30 hover:border-[#7B61FF] hover:shadow-[0_0_10px_rgba(123,97,255,0.3)] transition-all cursor-default"
                            >
                              {course}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
