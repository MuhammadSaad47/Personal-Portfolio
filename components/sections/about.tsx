"use client"

import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  MapPin,
  GraduationCap,
  Building2,
  Cpu,
  Sparkles,
  Wifi,
  CircuitBoard,
  Microchip,
  Code2,
  Layers,
  FolderGit2,
  Rocket,
  Calendar,
} from "lucide-react"
import dynamic from "next/dynamic"

interface AboutProps {
  profile: {
    name: string
    bio: string
    location: string
    university: string
    degree: string
  }
  specializations: string[]
}

/* ───────────────────────────────────────────
   Animated counter — counts from 0 → target
   ─────────────────────────────────────────── */
function AnimatedCounter({
  target,
  suffix = "",
  isInView,
}: {
  target: number
  suffix?: string
  isInView: boolean
}) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (isInView) spring.set(target)
  }, [isInView, target, spring])

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setValue(v))
    return unsubscribe
  }, [display])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

/* ───────────────────────────────────────────
   Typing code block with refined highlighting
   ─────────────────────────────────────────── */
function TypingCodeBlock({ isInView }: { isInView: boolean }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const codeLines = [
    "const engineer = {",
    '  name: "Muhammad Saad",',
    '  passion: "Hardware + Software",',
    '  expertise: ["FPGA", "RISC-V", "IoT"],',
    '  goal: "Innovate & Build",',
    '  status: "Always Learning"',
    "};",
  ]

  useEffect(() => {
    if (!isInView || isTyping) return
    setIsTyping(true)
    setDisplayedLines([])
    setCurrentLine(0)
    setCurrentChar(0)
  }, [isInView, isTyping])

  useEffect(() => {
    if (!isTyping || currentLine >= codeLines.length) return

    const line = codeLines[currentLine]
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev]
          newLines[currentLine] = line.substring(0, currentChar + 1)
          return newLines
        })
        setCurrentChar((c) => c + 1)
      }, 40)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1)
        setCurrentChar(0)
      }, 120)
      return () => clearTimeout(timeout)
    }
  }, [isTyping, currentLine, currentChar, codeLines])

  const highlightSyntax = (line: string) => {
    return line
      .replace(
        /(const|let|var)/g,
        '<span class="text-[#c678dd]">$1</span>'
      )
      .replace(
        /(".*?")/g,
        '<span class="text-[#98c379]">$1</span>'
      )
      .replace(
        /(\[.*?\])/g,
        '<span class="text-[#61afef]">$1</span>'
      )
      .replace(
        /(engineer)/g,
        '<span class="text-[#e5c07b]">$1</span>'
      )
      .replace(
        /(name|passion|expertise|goal|status)/g,
        '<span class="text-[#e06c75]">$1</span>'
      )
      .replace(
        /([{}();,])/g,
        '<span class="text-[#abb2bf]">$1</span>'
      )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
      className="relative p-6 rounded-xl glass overflow-hidden font-mono text-sm"
    >
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C9FF]/40 to-transparent animate-scan" />
      </div>

      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">
          engineer.ts
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f] animate-pulse" />
          <span className="text-[10px] text-muted-foreground/60">live</span>
        </div>
      </div>

      {/* Code content */}
      <div className="space-y-1">
        {displayedLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-8 text-right pr-4 text-muted-foreground/30 select-none text-xs leading-6">
              {i + 1}
            </span>
            <span
              dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }}
              className="text-muted-foreground leading-6"
            />
            {i === currentLine && currentLine < codeLines.length && (
              <span className="w-[2px] h-[18px] mt-1 bg-[#00C9FF] animate-pulse ml-0.5 rounded-full" />
            )}
          </div>
        ))}
        {currentLine >= codeLines.length && (
          <div className="flex">
            <span className="w-8 text-right pr-4 text-muted-foreground/30 select-none text-xs leading-6">
              {codeLines.length + 1}
            </span>
            <span className="w-[2px] h-[18px] mt-1 bg-[#00C9FF] animate-pulse rounded-full" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ───────────────────────────────────────────
   Specialization icon map
   ─────────────────────────────────────────── */
const specIcons: Record<string, typeof Cpu> = {
  IoT: Wifi,
  FPGA: CircuitBoard,
  "RISC-V": Microchip,
  "Embedded C": Code2,
  "Computer Architecture": Layers,
}

const specDescriptions: Record<string, string> = {
  IoT: "Internet of Things — Connected devices and sensor networks",
  FPGA: "Field Programmable Gate Arrays — Custom hardware acceleration",
  "RISC-V": "Open-source instruction set architecture",
  "Embedded C": "Low-level programming for microcontrollers",
  "Computer Architecture": "Design of processor and memory systems",
}

/* ───────────────────────────────────────────
   Container & item spring variants
   ─────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
}

const chipVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 14,
      delay: i * 0.08,
    },
  }),
}

/* ═══════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════ */
export function About({ profile, specializations }: AboutProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredSpec, setHoveredSpec] = useState<string | null>(null)

  const stats = [
    {
      value: 8,
      suffix: "+",
      label: "Projects",
      icon: FolderGit2,
      color: "#00C9FF",
    },
    {
      value: 5,
      suffix: "+",
      label: "Technologies",
      icon: Rocket,
      color: "#7B61FF",
    },
    {
      value: 4,
      suffix: "",
      label: "Final Year",
      icon: Calendar,
      color: "#FFB800",
      prefix: "Year ",
    },
  ]

  const highlights = [
    { icon: Building2, label: "University", value: "GIKI", color: "#00C9FF" },
    {
      icon: GraduationCap,
      label: "Degree",
      value: "BS Computer Engineering",
      color: "#7B61FF",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "FR Kohat, Pakistan",
      color: "#FFB800",
    },
    { icon: Cpu, label: "Focus", value: "Hardware & IoT", color: "#00C9FF" },
  ]

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C9FF]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* ── Section header with large faded "01" ── */}
          <motion.div variants={itemVariants} className="text-center mb-16 relative">
            {/* Large faded section number */}
            <span
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[10rem] font-bold opacity-[0.03] pointer-events-none select-none font-[family-name:var(--font-space-grotesk)]"
              aria-hidden="true"
            >
              01
            </span>

            <span className="text-[#00C9FF] font-mono text-sm mb-2 block tracking-wider">
              {"// About Me"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Get to Know <span className="text-gradient">Me</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#FFB800] mx-auto rounded-full" />
          </motion.div>

          {/* ── Stat counters ── */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 sm:gap-6 mb-16 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center p-4 sm:p-6 rounded-2xl glass hover:shadow-lg transition-shadow duration-300"
              >
                <stat.icon
                  className="h-5 w-5 mx-auto mb-2 opacity-60"
                  style={{ color: stat.color }}
                />
                <p
                  className="text-2xl sm:text-3xl font-bold font-mono"
                  style={{ color: stat.color }}
                >
                  {stat.prefix ?? ""}
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                  />
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* ── Left column: Bio ── */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Bio card with animated-border */}
              <div className="animated-border rounded-2xl">
                <div className="p-6 sm:p-8 rounded-2xl bg-background/80">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Currently in my final year at{" "}
                    <span className="text-[#00C9FF] font-medium">
                      {profile.university}
                    </span>
                    , I specialize in bridging the gap between hardware and
                    software — crafting embedded systems, FPGA accelerators, and
                    IoT solutions that push the boundaries of modern engineering.
                  </p>
                </div>
              </div>

              {/* Highlight cards with animated gradient borders */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {highlights.map((item, i) => (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      y: -3,
                      transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    className="relative p-4 rounded-xl glass overflow-hidden group cursor-default"
                  >
                    {/* Animated gradient left border */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                      style={{
                        background: `linear-gradient(180deg, ${item.color}, transparent)`,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: 0.3 + i * 0.1,
                      }}
                    />
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 30% 50%, ${item.color}12, transparent 70%)`,
                      }}
                    />
                    <item.icon
                      className="h-5 w-5 mb-2 transition-all duration-300 group-hover:scale-110 relative z-10"
                      style={{ color: item.color }}
                    />
                    <p className="text-xs text-muted-foreground relative z-10">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium relative z-10">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Right column: Specializations + Code ── */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Core specializations */}
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-[#FFB800] animate-pulse" />
                <h3 className="text-xl font-semibold font-[family-name:var(--font-space-grotesk)]">
                  Core Specializations
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 relative">
                {specializations.map((spec, index) => {
                  const Icon = specIcons[spec] || Cpu
                  return (
                    <motion.div
                      key={spec}
                      custom={index}
                      variants={chipVariants}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      className="relative"
                      onMouseEnter={() => setHoveredSpec(spec)}
                      onMouseLeave={() => setHoveredSpec(null)}
                    >
                      <motion.span
                        whileHover={{
                          scale: 1.07,
                          boxShadow: "0 0 20px rgba(0,201,255,0.35)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-[#00C9FF]/30 text-[#00C9FF] font-medium text-sm hover:border-[#00C9FF] transition-colors duration-300 cursor-default"
                      >
                        <Icon className="h-3.5 w-3.5 opacity-70" />
                        {spec}
                      </motion.span>

                      {/* Tooltip */}
                      {hoveredSpec === spec && specDescriptions[spec] && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2.5 rounded-lg glass-strong text-xs text-muted-foreground whitespace-nowrap shadow-xl"
                        >
                          {specDescriptions[spec]}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[rgba(0,201,255,0.15)]" />
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Typing code block */}
              <div className="mt-8">
                <TypingCodeBlock isInView={isInView} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
