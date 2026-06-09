"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Github, ExternalLink, Folder } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  github: string
  live: string
  thumbnail: string
}

interface ProjectsProps {
  projects: Project[]
}

const filters = ["All", "Hardware", "Software", "IoT", "Full-Stack"]

// Category colors
const categoryColors: Record<string, string> = {
  Hardware: "#00C9FF",
  Software: "#7B61FF",
  IoT: "#FFB800",
  "Full-Stack": "#00E5FF"
}

// Generate procedural circuit pattern based on project ID
function generateCircuitPattern(id: string, category: string) {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = categoryColors[category] || "#00C9FF"
  
  const paths = []
  for (let i = 0; i < 8; i++) {
    const startX = ((seed + i * 17) % 80) + 10
    const startY = ((seed + i * 23) % 60) + 20
    const midX = ((seed + i * 31) % 60) + 20
    const midY = ((seed + i * 13) % 40) + 30
    const endX = ((seed + i * 41) % 80) + 10
    const endY = ((seed + i * 19) % 60) + 20
    
    paths.push(`M${startX} ${startY} L${midX} ${midY} L${endX} ${endY}`)
  }
  
  return { paths, color }
}

export function Projects({ projects }: ProjectsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeFilter, setActiveFilter] = useState("All")
  const [visibleCount, setVisibleCount] = useState(6)

  const filteredProjects = projects.filter(
    (project) =>
      activeFilter === "All" || project.category === activeFilter
  )

  const displayedProjects = filteredProjects.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(6)
  }, [activeFilter])

  return (
    <section id="projects" className="py-20 lg:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C9FF]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-[#00C9FF] font-mono text-sm mb-2 block">
              {"// My Work"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#FFB800] mx-auto rounded-full" />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "glass border-[#00C9FF] text-[#00C9FF] shadow-[0_0_15px_rgba(0,201,255,0.3)]"
                    : "glass border-border hover:border-[#00C9FF]/50"
                }`}
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Projects Grid - Masonry-like with staggered animation */}
          <motion.div 
            layout 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {visibleCount < filteredProjects.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <Button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="glass border-[#00C9FF]/50 hover:border-[#00C9FF] hover:shadow-[0_0_20px_rgba(0,201,255,0.3)] bg-transparent hover:bg-[#00C9FF]/10 text-[#00C9FF]"
              >
                Load More Projects
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: Project
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { paths, color } = generateCircuitPattern(project.id, project.category)
  const tagColor = categoryColors[project.category] || "#00C9FF"
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl glass overflow-hidden card-3d"
      style={{
        transform: isHovered ? 'perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02)' : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Thumbnail / Pattern */}
      <div className="relative h-48 overflow-hidden bg-navy-light">
        {!imageError && project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Procedural circuit pattern fallback */
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`grad-${project.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" fill={`url(#grad-${project.id})`} />
              {paths.map((path, i) => (
                <path
                  key={i}
                  d={path}
                  stroke={color}
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.5"
                  className={isHovered ? 'animate-signal' : ''}
                  style={{ strokeDasharray: isHovered ? '5 10' : 'none' }}
                />
              ))}
              {/* Circuit nodes */}
              {[20, 40, 60, 80].map((x) => (
                [25, 50, 75].map((y) => (
                  <circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill={color}
                    opacity={isHovered ? "0.8" : "0.4"}
                    className={isHovered ? 'animate-pulse-glow' : ''}
                  />
                ))
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder className="h-12 w-12" style={{ color, opacity: 0.3 }} />
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040D18] via-[#040D18]/50 to-transparent opacity-80" />

        {/* Hover overlay with links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-[#040D18]/80 flex items-center justify-center gap-4"
        >
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full glass hover:border-[#00C9FF] hover:shadow-[0_0_15px_rgba(0,201,255,0.5)] transition-all"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5 text-[#00C9FF]" />
            </motion.a>
          )}
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full glass hover:border-[#FFB800] hover:shadow-[0_0_15px_rgba(255,184,0,0.5)] transition-all"
              aria-label="View live demo"
            >
              <ExternalLink className="h-5 w-5 text-[#FFB800]" />
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00C9FF] transition-colors font-[family-name:var(--font-space-grotesk)]">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md font-mono transition-all duration-300"
              style={{ 
                backgroundColor: `${tagColor}15`,
                color: tagColor,
                borderWidth: '1px',
                borderColor: `${tagColor}30`
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          boxShadow: `inset 0 0 0 1px ${tagColor}, 0 0 25px ${tagColor}40`
        }}
      />
    </motion.div>
  )
}
