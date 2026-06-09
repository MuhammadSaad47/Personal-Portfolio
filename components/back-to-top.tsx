"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 300px
      setIsVisible(window.scrollY > 300)

      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Circular progress configuration
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - scrollProgress * circumference

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="relative rounded-full h-12 w-12 glass border-[#00C9FF]/30 hover:border-[#00C9FF] bg-[#00C9FF]/10 hover:bg-[#00C9FF]/20 text-[#00C9FF] hover:shadow-[0_0_20px_rgba(0,201,255,0.4)] transition-all duration-300 group overflow-visible"
            aria-label="Back to top"
          >
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none overflow-visible" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-muted-foreground/10 fill-none"
                strokeWidth="2.5"
              />
              <motion.circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-[#00C9FF] fill-none"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform z-10" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

