"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Briefcase, Rocket, Cpu, Zap } from "lucide-react"

interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
  isPlaceholder?: boolean
}

interface ExperienceProps {
  experience: Experience[]
}

// Animated timeline line that draws itself
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
        <linearGradient id="timeline-gradient-exp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="50%" stopColor="#00C9FF" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Main line */}
      <line
        x1="16"
        y1="0"
        x2="16"
        y2="100%"
        stroke="url(#timeline-gradient-exp)"
        strokeWidth="2"
        strokeDasharray="1000"
        strokeDashoffset={1000 - (lineLength * 10)}
        style={{ transition: 'stroke-dashoffset 2s ease-out' }}
      />
    </svg>
  )
}

// Chip node for timeline
function ChipNode({ isActive, delay, isPlaceholder }: { isActive: boolean; delay: number; isPlaceholder?: boolean }) {
  const color = isPlaceholder ? "#FFB800" : "#00C9FF"
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={isActive ? { scale: 1, rotate: 0 } : {}}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="absolute left-0 md:left-1/2 top-0 w-8 h-8 transform -translate-x-1/2 z-10"
    >
      <div className="relative w-full h-full">
        <div 
          className="absolute inset-1 rounded bg-[#0a1628] border"
          style={{ borderColor: `${color}50` }}
        >
          {isPlaceholder ? (
            <Rocket className="w-full h-full p-1" style={{ color }} />
          ) : (
            <Briefcase className="w-full h-full p-1" style={{ color }} />
          )}
        </div>
        {/* Glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded blur-sm"
          style={{ backgroundColor: `${color}30` }}
        />
      </div>
    </motion.div>
  )
}

export function Experience({ experience }: ExperienceProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="experience" className="py-20 lg:py-32 relative">
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
              {"// Experience"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Professional <span className="text-gradient">Journey</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#FFB800] mx-auto rounded-full" />
          </div>

          {/* Timeline or Bento Grid */}
          {experience.length === 1 ? (
            <div className="max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.01, y: -4 }}
                className="rounded-3xl glass p-8 md:p-12 relative overflow-hidden border border-[#FFB800]/30 shadow-[0_0_50px_rgba(255,184,0,0.08)] hover:shadow-[0_0_60px_rgba(255,184,0,0.18)] transition-all duration-500"
              >
                {/* Circuit board corner decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                    <path d="M0 20 H50 L70 40 V100" stroke="#FFB800" strokeWidth="1.5" />
                    <circle cx="50" cy="20" r="3" fill="#FFB800" />
                    <circle cx="70" cy="60" r="3" fill="#00C9FF" />
                  </svg>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                  {/* Left: Graphic Microprocessor Block */}
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative w-40 h-40 bg-[#0a1628] rounded-2xl border-2 border-[#FFB800]/40 flex items-center justify-center glow-gold">
                      <Briefcase className="h-16 w-16 text-[#FFB800] animate-pulse" />
                      {/* Silicon traces around edge */}
                      {Array.from({ length: 4 }).map((_, side) => (
                        <div key={side} className="absolute inset-0">
                          {Array.from({ length: 5 }).map((_, pinIdx) => {
                            const offset = (pinIdx - 2) * 20
                            return (
                              <span 
                                key={pinIdx}
                                className="absolute bg-[#00C9FF] w-2 h-1 shadow-[0_0_5px_#00C9FF]"
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
                      <span className="text-xs font-mono text-[#FFB800] px-4 py-1.5 rounded-full glass border border-[#FFB800]/30 animate-pulse">
                        {experience[0].period}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-gradient">
                      {experience[0].position}
                    </h3>
                    
                    <p className="text-lg font-medium text-[#FFB800]">
                      {experience[0].company}
                    </p>

                    <hr className="border-[#FFB800]/20 my-4" />

                    <p className="text-muted-foreground text-base leading-relaxed">
                      {experience[0].description}
                    </p>

                    {experience[0].isPlaceholder && (
                      <motion.div 
                        className="flex items-center gap-2 pt-2"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="h-5 w-5 text-[#FFB800]" />
                        <span className="text-sm text-[#FFB800] font-mono cursor-blink">
                          Open to Internships, Projects & Research Roles
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="relative max-w-3xl mx-auto">
              <AnimatedTimelineLine isInView={isInView} />

              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                  className={`relative pl-12 md:pl-0 pb-16 ${
                    index % 2 === 0 ? "md:pr-[calc(50%+2.5rem)]" : "md:pl-[calc(50%+2.5rem)]"
                  }`}
                >
                  <ChipNode isActive={isInView} delay={index * 0.3 + 0.2} isPlaceholder={exp.isPlaceholder} />

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-6 rounded-2xl glass transition-all duration-300 ${
                      exp.isPlaceholder
                        ? "border-[#FFB800]/30 hover:border-[#FFB800]/50 hover:shadow-[0_0_30px_rgba(255,184,0,0.15)]"
                        : "hover:shadow-[0_0_30px_rgba(0,201,255,0.15)]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl shrink-0 border ${
                          exp.isPlaceholder 
                            ? "bg-[#FFB800]/10 border-[#FFB800]/20" 
                            : "bg-[#00C9FF]/10 border-[#00C9FF]/20"
                        }`}
                      >
                        {exp.isPlaceholder ? (
                          <Rocket className="h-6 w-6 text-[#FFB800]" />
                        ) : (
                          <Briefcase className="h-6 w-6 text-[#00C9FF]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-xs font-mono px-3 py-1 rounded-full mb-2 inline-block glass ${
                            exp.isPlaceholder
                              ? "text-[#FFB800] border-[#FFB800]/30"
                              : "text-[#00C9FF] border-[#00C9FF]/30"
                          }`}
                        >
                          {exp.period}
                        </span>
                        <h3 className="text-lg font-semibold mb-1 font-[family-name:var(--font-space-grotesk)]">
                          {exp.position}
                        </h3>
                        <p
                          className={`text-sm mb-3 font-medium ${
                            exp.isPlaceholder ? "text-[#FFB800]" : "text-[#00C9FF]"
                          }`}
                        >
                          {exp.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exp.description}
                        </p>
                        
                        {exp.isPlaceholder && (
                          <motion.div 
                            className="flex items-center gap-2 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Zap className="h-4 w-4 text-[#FFB800]" />
                            <span className="text-xs text-[#FFB800] font-mono cursor-blink">
                              Open to opportunities
                            </span>
                          </motion.div>
                        )}
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
