"use client"

import { motion } from "framer-motion"
import { ArrowDown, Download, ExternalLink, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Typewriter } from "@/components/typewriter"
import dynamic from "next/dynamic"
import Image from "next/image"

const HeroChip3D = dynamic(() => import("@/components/3d/hero-chip").then(mod => mod.HeroChip3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 animate-pulse" />
    </div>
  )
})

interface HeroProps {
  profile: {
    name: string
    titles: string[]
    bio: string
    profileImage: string
    resumeUrl: string
    email: string
    github: string
    linkedin: string
  }
}

export function Hero({ profile }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background z-10 pointer-events-none" />

      {/* Immersive Massive 3D Background Canvas covering the entire Hero area */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-85 lg:opacity-100">
        <HeroChip3D />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left max-w-2xl relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#00C9FF] animate-pulse" />
              <span className="text-[#00C9FF] font-mono text-sm">Available for opportunities</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]"
            >
              {"I'm "}
              <span className="text-gradient">{profile.name}</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-6 h-12 font-[family-name:var(--font-space-grotesk)]"
            >
              <Typewriter 
                texts={profile.titles} 
                className="text-[#00C9FF]" 
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Building innovative solutions at the intersection of hardware and software.
              Specializing in FPGA design, embedded systems, and IoT architectures.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <Button
                size="lg"
                asChild
                className="group glass border-[#00C9FF]/50 hover:border-[#00C9FF] hover:shadow-[0_0_20px_rgba(0,201,255,0.3)] bg-[#00C9FF]/10 hover:bg-[#00C9FF]/20 text-[#00C9FF] transition-all duration-300"
              >
                <a href="#projects">
                  View My Work
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group glass border-[#FFB800]/50 hover:border-[#FFB800] hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:bg-[#FFB800]/10 text-[#FFB800] transition-all duration-300"
              >
                <a href={profile.resumeUrl} download>
                  Download Resume
                  <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                </a>
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <a 
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass hover:border-[#00C9FF] hover:shadow-[0_0_15px_rgba(0,201,255,0.3)] transition-all duration-300 group"
              >
                <Github className="h-5 w-5 text-muted-foreground group-hover:text-[#00C9FF] transition-colors" />
              </a>
              {profile.linkedin && (
                <a 
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full glass hover:border-[#00C9FF] hover:shadow-[0_0_15px_rgba(0,201,255,0.3)] transition-all duration-300 group"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-[#00C9FF] transition-colors" />
                </a>
              )}
              <a 
                href={`mailto:${profile.email}`}
                className="p-3 rounded-full glass hover:border-[#00C9FF] hover:shadow-[0_0_15px_rgba(0,201,255,0.3)] transition-all duration-300 group"
              >
                <Mail className="h-5 w-5 text-muted-foreground group-hover:text-[#00C9FF] transition-colors" />
              </a>
            </motion.div>
          </motion.div>

          {/* Profile Section (floating on the right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex-1 max-w-lg w-full flex items-center justify-center min-h-[350px] lg:justify-end"
          >
            {/* Massive, Catchy Cybernetic Profile Frame Assembly */}
            <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center lg:mr-8">
              
              {/* Outer Rotating Gear Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-[#00C9FF]/30 pointer-events-none"
              />
              
              {/* Secondary Counter-Rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[15px] rounded-full border border-dashed border-[#FFB800]/25 pointer-events-none"
              />

              {/* Glowing Halo */}
              <div className="absolute inset-[30px] rounded-full bg-gradient-to-tr from-[#00C9FF]/10 via-transparent to-[#7B61FF]/10 blur-xl pointer-events-none" />

              {/* Main Circular Profile Container */}
              <div className="absolute inset-[25px] rounded-full overflow-hidden border-2 border-[#00C9FF]/50 bg-[#040D18]/90 hover:border-[#00C9FF] hover:shadow-[0_0_35px_rgba(0,201,255,0.4)] transition-all duration-500 group">
                
                {/* Profile Image */}
                <Image
                  src={profile.profileImage}
                  alt={profile.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
                
                {/* Glowing Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040D18]/40 via-transparent to-[#7B61FF]/10 pointer-events-none" />
                
                {/* Sweeping Laser Scanner Line */}
                <div className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#00C9FF] to-transparent shadow-[0_0_12px_#00C9FF] animate-scan z-20 pointer-events-none" />
              </div>

              {/* HUD / Telemetry Readouts around profile picture */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-[#0a1628]/95 border border-[#00C9FF]/30 text-[9px] font-mono text-[#00C9FF] tracking-wider uppercase shadow-[0_0_10px_rgba(0,201,255,0.15)] pointer-events-none whitespace-nowrap">
                GIKI // COMPUTER_ENG
              </div>

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-[#0a1628]/95 border border-[#7B61FF]/30 text-[9px] font-mono text-[#7B61FF] tracking-wider pointer-events-none whitespace-nowrap shadow-[0_0_10px_rgba(123,97,255,0.15)]">
                CORE: CPU_ARCH // EMBEDDED // IOT
              </div>

              {/* Cybernetic Tech Corners */}
              {[-1, 1].map((x) =>
                [-1, 1].map((y) => (
                  <div
                    key={`${x}-${y}`}
                    className="absolute w-4 h-4 pointer-events-none"
                    style={{
                      top: y === -1 ? '0px' : 'auto',
                      bottom: y === 1 ? '0px' : 'auto',
                      left: x === -1 ? '0px' : 'auto',
                      right: x === 1 ? '0px' : 'auto',
                      borderTop: y === -1 ? '2px solid #00C9FF' : 'none',
                      borderBottom: y === 1 ? '2px solid #00C9FF' : 'none',
                      borderLeft: x === -1 ? '2px solid #00C9FF' : 'none',
                      borderRight: x === 1 ? '2px solid #00C9FF' : 'none',
                    }}
                  />
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-[#00C9FF] transition-colors"
          >
            <span className="text-xs font-mono">Scroll Down</span>
            {/* Animated circuit trace scroll indicator */}
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="overflow-visible">
              <path 
                d="M12 0 L12 30 M12 30 L6 24 M12 30 L18 24" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-border-trace"
                style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
