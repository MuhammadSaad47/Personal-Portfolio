"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import { Code2, Server, Cpu, Layers } from "lucide-react"
import * as d3 from "d3"

interface Skill {
  name: string
  level: number
}

interface SkillsProps {
  skills: {
    languages: Skill[]
    libraries: Skill[]
    hardware: Skill[]
    domains: Skill[]
  }
}

type CategoryKey = 'languages' | 'libraries' | 'hardware' | 'domains'

const categories: { key: CategoryKey; label: string; icon: typeof Code2; color: string }[] = [
  { key: "languages", label: "Languages", icon: Code2, color: "#00C9FF" },
  { key: "libraries", label: "Libraries", icon: Server, color: "#7B61FF" },
  { key: "hardware", label: "Hardware", icon: Cpu, color: "#FFB800" },
  { key: "domains", label: "Domains", icon: Layers, color: "#00E5FF" },
]

// Featured expertise badges
const expertiseBadges = [
  { label: "FPGA Design", icon: "⚡" },
  { label: "Embedded C/C++", icon: "💻" },
  { label: "RISC-V Architecture", icon: "🔧" },
  { label: "IoT Systems", icon: "📡" },
]

// Skill Constellation component using D3 force simulation
function SkillConstellation({ skills, isInView }: { skills: SkillsProps['skills']; isInView: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  
  // Prepare nodes data
  const nodes = useCallback(() => {
    const result: { id: string; category: CategoryKey; level: number; x?: number; y?: number; fx?: number | null; fy?: number | null }[] = []
    
    Object.entries(skills).forEach(([category, skillList]) => {
      skillList.forEach((skill) => {
        result.push({
          id: skill.name,
          category: category as CategoryKey,
          level: skill.level
        })
      })
    })
    
    return result
  }, [skills])
  
  useEffect(() => {
    if (!svgRef.current || !isInView) return
    
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(400, Math.min(500, window.innerHeight * 0.5))
        })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [isInView])
  
  useEffect(() => {
    if (!svgRef.current || !isInView) return
    
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    
    const { width, height } = dimensions
    const nodeData = nodes()
    
    // Create category centers
    const categoryPositions: Record<CategoryKey, { x: number; y: number }> = {
      languages: { x: width * 0.25, y: height * 0.3 },
      libraries: { x: width * 0.75, y: height * 0.3 },
      hardware: { x: width * 0.25, y: height * 0.7 },
      domains: { x: width * 0.75, y: height * 0.7 }
    }
    
    // Create links between nodes in same category
    const links: { source: string; target: string }[] = []
    Object.keys(skills).forEach((category) => {
      const categorySkills = skills[category as CategoryKey]
      for (let i = 0; i < categorySkills.length - 1; i++) {
        links.push({
          source: categorySkills[i].name,
          target: categorySkills[i + 1].name
        })
      }
    })
    
    // Force simulation
    const simulation = d3.forceSimulation(nodeData)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("link", d3.forceLink(links).id((d: d3.SimulationNodeDatum & { id?: string }) => d.id || '').distance(60))
      .force("x", d3.forceX((d: { category?: CategoryKey }) => categoryPositions[d.category || 'languages'].x).strength(0.3))
      .force("y", d3.forceY((d: { category?: CategoryKey }) => categoryPositions[d.category || 'languages'].y).strength(0.3))
      .force("collision", d3.forceCollide().radius(30))
    
    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(0, 201, 255, 0.2)")
      .attr("stroke-width", 1)
    
    // Create node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(nodeData)
      .join("g")
      .attr("cursor", "pointer")
      .on("mouseenter", function(event, d) {
        setHoveredNode(d.id)
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: { level: number }) => Math.max(12, d.level / 5) + 5)
      })
      .on("mouseleave", function(event, d) {
        setHoveredNode(null)
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", (d: { level: number }) => Math.max(12, d.level / 5))
      })
    
    // Get color by category
    const getColor = (category: CategoryKey) => {
      const cat = categories.find(c => c.key === category)
      return cat?.color || "#00C9FF"
    }
    
    // Node circles
    node.append("circle")
      .attr("r", 0)
      .attr("fill", (d) => getColor(d.category))
      .attr("opacity", 0.8)
      .transition()
      .delay((_, i) => i * 50)
      .duration(500)
      .attr("r", (d) => Math.max(12, d.level / 5))
    
    // Glow filter
    const defs = svg.append("defs")
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%")
    
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur")
    
    const feMerge = filter.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")
    
    node.selectAll("circle").style("filter", "url(#glow)")
    
    // Node labels
    node.append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => Math.max(12, d.level / 5) + 16)
      .attr("fill", "var(--foreground)")
      .attr("font-size", "11px")
      .attr("font-family", "var(--font-mono)")
      .attr("opacity", 0)
      .transition()
      .delay((_, i) => i * 50 + 300)
      .duration(300)
      .attr("opacity", 0.8)
    
    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: { source: { x: number } }) => d.source.x)
        .attr("y1", (d: { source: { y: number } }) => d.source.y)
        .attr("x2", (d: { target: { x: number } }) => d.target.x)
        .attr("y2", (d: { target: { y: number } }) => d.target.y)
      
      node.attr("transform", (d: { x?: number; y?: number }) => `translate(${d.x || 0},${d.y || 0})`)
    })
    
    return () => {
      simulation.stop()
    }
  }, [isInView, dimensions, nodes, skills])
  
  return (
    <div className="relative w-full">
      {/* Category labels */}
      <div className="absolute top-2 left-4 flex flex-wrap gap-4 z-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onMouseEnter={() => setHoveredCategory(cat.key)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium transition-all duration-300 ${
              hoveredCategory === cat.key ? 'scale-105' : ''
            }`}
            style={{ 
              borderColor: hoveredCategory === cat.key ? cat.color : 'transparent',
              boxShadow: hoveredCategory === cat.key ? `0 0 15px ${cat.color}40` : 'none'
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            {cat.label}
          </button>
        ))}
      </div>
      
      {/* SVG Constellation */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      />
      
      {/* Hovered node tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg glass text-sm">
          <span className="font-medium text-[#00C9FF]">{hoveredNode}</span>
        </div>
      )}
    </div>
  )
}

// Mobile fallback: skill cards grid
function SkillCardsGrid({ skills, isInView }: { skills: SkillsProps['skills']; isInView: boolean }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category.key}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
          className="p-5 rounded-xl glass"
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <category.icon className="h-4 w-4" style={{ color: category.color }} />
            </div>
            <h3 className="font-semibold text-sm">{category.label}</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills[category.key].map((skill, skillIndex) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium glass hover:scale-105 transition-transform"
                style={{ 
                  color: category.color,
                  borderColor: `${category.color}30`
                }}
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function Skills({ skills }: SkillsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section id="skills" className="py-20 lg:py-32 relative">
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
              {"// Tech Stack"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Skills & <span className="text-gradient">Technologies</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#FFB800] mx-auto rounded-full" />
          </div>

          {/* Featured Expertise Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {expertiseBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="px-6 py-3 rounded-xl glass border-[#00C9FF]/30 hover:border-[#00C9FF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,201,255,0.3)]">
                  {/* Animated border trace */}
                  <svg className="absolute inset-0 w-full h-full rounded-xl overflow-visible pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <rect
                      x="0.5"
                      y="0.5"
                      width="calc(100% - 1px)"
                      height="calc(100% - 1px)"
                      rx="11"
                      fill="none"
                      stroke="#00C9FF"
                      strokeWidth="1"
                      strokeDasharray="200"
                      strokeDashoffset="200"
                      className="group-hover:animate-border-trace"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-[#00C9FF]">{badge.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skill Constellation (desktop) or Cards (mobile) */}
          <div className="rounded-2xl glass overflow-hidden">
            {isMobile ? (
              <div className="p-4">
                <SkillCardsGrid skills={skills} isInView={isInView} />
              </div>
            ) : (
              <SkillConstellation skills={skills} isInView={isInView} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
