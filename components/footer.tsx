"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart, Cpu } from "lucide-react"

interface FooterProps {
  profile: {
    name: string
    email: string
    github: string
    linkedin: string
  }
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Contact", href: "#contact" },
  ]

  const socialLinks = [
    { icon: Github, href: profile.github, label: "GitHub", color: "#7B61FF" },
    { icon: Linkedin, href: profile.linkedin || "#", label: "LinkedIn", color: "#00C9FF" },
    { icon: Mail, href: `mailto:${profile.email}`, label: "Email", color: "#FFB800" },
  ]

  return (
    <footer className="relative py-12 overflow-hidden mt-12">
      {/* Animated gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00C9FF] via-[#7B61FF] to-[#FFB800] bg-[size:200%_auto] animate-[gradient-shift_8s_ease_infinite] opacity-60" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="#" className="inline-flex items-center gap-2 mb-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#00C9FF]/10 border border-[#00C9FF]/30 flex items-center justify-center group-hover:border-[#00C9FF] group-hover:shadow-[0_0_15px_rgba(0,201,255,0.3)] transition-all">
                <Cpu className="w-5 h-5 text-[#00C9FF]" />
              </div>
              <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-gradient">
                MS
              </span>
            </a>
            <p className="text-sm text-muted-foreground">
              Computer Engineer & Embedded Systems Developer
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-sm font-semibold mb-4 text-[#00C9FF]">Quick Links</h4>
            <nav className="flex flex-wrap justify-center gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-[#00C9FF] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-semibold mb-4 text-[#00C9FF]">Connect</h4>
            <div className="flex justify-center md:justify-end gap-3">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -3,
                    boxShadow: `0 0 20px ${link.color}40`,
                    borderColor: link.color
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg glass border transition-colors duration-300"
                  style={{ 
                    borderColor: `${link.color}30`
                  }}
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" style={{ color: link.color }} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider - Circuit trace style */}
        <div className="relative h-px mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00C9FF]/30 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00C9FF]/50" />
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
            <span>&copy; {currentYear} {profile.name}.</span>
            <span className="flex items-center gap-1">
              Built with
              <Heart className="h-4 w-4 text-red-500 inline animate-pulse" />
              using Next.js & Three.js
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
