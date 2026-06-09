"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Skills } from "@/components/sections/skills"
import { Projects } from "@/components/sections/projects"
import { Education } from "@/components/sections/education"
import { Experience } from "@/components/sections/experience"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { CircuitBackground } from "@/components/circuit-background"
import initialContent from "@/data/content.json"

// Lazy load 3D background for performance
const Scene3DBackground = dynamic(
  () => import("@/components/3d/scene-background").then(mod => mod.Scene3DBackground),
  { 
    ssr: false,
    loading: () => null 
  }
)

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Home() {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    const savedContent = localStorage.getItem("portfolio_content")
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent))
      } catch (e) {
        console.error("Failed to parse saved content", e)
      }
    }
  }, [])

  return (
    <main className="min-h-screen relative">
      {/* Interactive Particle Background */}
      <CircuitBackground />

      {/* Noise texture overlay for depth */}
      <div className="noise-overlay" />

      {/* 3D Animated Background */}
      <Scene3DBackground />
      
      {/* Content with staggered entrance */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <Navigation />
        
        <motion.div variants={sectionVariants}>
          <Hero profile={content.profile} />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <About profile={content.profile} specializations={content.specializations} />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <Skills skills={content.skills} />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <Projects projects={content.projects} />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <Education education={content.education} />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <Experience experience={content.experience} />
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <Contact profile={content.profile} />
        </motion.div>
        
        <Footer profile={content.profile} />
      </motion.div>
      
      <BackToTop />
    </main>
  )
}
