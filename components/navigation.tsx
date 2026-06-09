"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { Menu, X, Github, Moon, Sun, Cpu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // Smooth scroll-based header opacity via Framer Motion
  const { scrollY } = useScroll()
  const headerBgOpacity = useTransform(scrollY, [0, 80, 150], [0, 0.6, 1])
  const headerBlur = useTransform(scrollY, [0, 80, 150], [0, 12, 20])
  const headerBorderOpacity = useTransform(scrollY, [0, 80, 150], [0, 0.08, 0.15])

  // Track scroll threshold for boolean state
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  // IntersectionObserver for active section detection
  useEffect(() => {
    setMounted(true)

    const sectionIds = navItems.map((item) => item.href.replace("#", ""))
    const observers: IntersectionObserver[] = []

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`)
        }
      })
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        const observer = new IntersectionObserver(handleIntersect, {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0,
        })
        observer.observe(el)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  // Update sliding pill position when hovering or when active section changes
  const updatePillPosition = useCallback(
    (index: number | null) => {
      const targetIndex = index !== null ? index : navItems.findIndex((item) => item.href === activeSection)
      if (targetIndex >= 0 && linkRefs.current[targetIndex] && navRef.current) {
        const linkEl = linkRefs.current[targetIndex]!
        const navEl = navRef.current
        const linkRect = linkEl.getBoundingClientRect()
        const navRect = navEl.getBoundingClientRect()
        setPillStyle({
          left: linkRect.left - navRect.left,
          width: linkRect.width,
          opacity: 1,
        })
      } else if (index === null && activeSection === "") {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }))
      }
    },
    [activeSection]
  )

  useEffect(() => {
    if (hoveredIndex === null) {
      updatePillPosition(null)
    }
  }, [activeSection, hoveredIndex, updatePillPosition])

  const handleLinkHover = (index: number) => {
    setHoveredIndex(index)
    updatePillPosition(index)
  }

  const handleLinkLeave = () => {
    setHoveredIndex(null)
    updatePillPosition(null)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled
          ? "var(--glass-bg)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid var(--glass-border)"
          : "1px solid transparent",
      }}
    >
      {/* Dynamic glass backdrop driven by scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: headerBgOpacity,
          backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          WebkitBackdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          borderBottom: useTransform(
            headerBorderOpacity,
            (v) => `1px solid rgba(0, 201, 255, ${v})`
          ),
        }}
      />

      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-[#00C9FF]/10 border border-[#00C9FF]/30 flex items-center justify-center group-hover:border-[#00C9FF] group-hover:shadow-[0_0_15px_rgba(0,201,255,0.3)] transition-all duration-300">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Cpu className="w-5 h-5 text-[#00C9FF]" />
                </motion.div>
              </div>
              {/* Animated corner dot */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00C9FF]"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-gradient tracking-wide whitespace-nowrap">
              Muhammad Saad
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 relative" ref={navRef}>
            {/* Sliding pill / underline indicator */}
            <motion.div
              className="absolute bottom-[6px] h-[2px] rounded-full bg-[#00C9FF] pointer-events-none z-0"
              animate={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              style={{
                boxShadow: "0 0 8px rgba(0,201,255,0.5), 0 0 16px rgba(0,201,255,0.2)",
              }}
            />

            {navItems.map((item, index) => {
              const isActive = activeSection === item.href
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  ref={(el) => {
                    linkRefs.current[index] = el
                  }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.08,
                  }}
                  onMouseEnter={() => handleLinkHover(index)}
                  onMouseLeave={handleLinkLeave}
                  className={`relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                    isActive
                      ? "text-[#00C9FF]"
                      : "text-muted-foreground hover:text-[#00C9FF]"
                  } hover:bg-[#00C9FF]/5`}
                >
                  {item.name}
                </motion.a>
              )
            })}

            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full hover:bg-[#00C9FF]/10 hover:text-[#00C9FF] transition-all duration-300"
              >
                {mounted && (
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </motion.div>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full hover:bg-[#7B61FF]/10 hover:text-[#7B61FF] transition-all duration-300"
              >
                <a href="https://github.com/MuhammadSaad47" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Slide-in drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-background/60 backdrop-blur-md md:hidden"
                style={{ top: "64px" }}
              />

              {/* Drawer */}
              <motion.div
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 28,
                  mass: 0.8,
                }}
                className="fixed right-0 top-16 bottom-0 w-72 glass-strong overflow-hidden md:hidden"
              >
                <div className="px-4 py-6 space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = activeSection === item.href
                    return (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: index * 0.06,
                        }}
                        className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                          isActive
                            ? "text-[#00C9FF] bg-[#00C9FF]/10 border-l-2 border-[#00C9FF]"
                            : "text-muted-foreground hover:text-[#00C9FF] hover:bg-[#00C9FF]/10"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active-dot"
                              className="w-1.5 h-1.5 rounded-full bg-[#00C9FF]"
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            />
                          )}
                          {item.name}
                        </span>
                      </motion.a>
                    )
                  })}
                  <hr className="border-border my-4" />
                  <motion.a
                    href="https://github.com/MuhammadSaad47"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.4,
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-[#7B61FF] hover:bg-[#7B61FF]/10 rounded-lg transition-all duration-300"
                  >
                    <Github className="h-5 w-5" />
                    GitHub Profile
                  </motion.a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
