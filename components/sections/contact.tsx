"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Send, Mail, Github, Linkedin, MapPin, Loader2, Zap, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactProps {
  profile: {
    email: string
    github: string
    linkedin: string
    location: string
  }
}

export function Contact({ profile }: ContactProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // For now, simulate form submission (can be replaced with EmailJS)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000)
  }

  const socialLinks = [
    { icon: Mail, label: "Email", href: `mailto:${profile.email}`, value: profile.email, color: "#00C9FF" },
    { icon: Github, label: "GitHub", href: profile.github, value: "MuhammadSaad47", color: "#7B61FF" },
    { icon: Linkedin, label: "LinkedIn", href: profile.linkedin || "#", value: "Connect", color: "#00C9FF" },
  ]

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C9FF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-[#00C9FF] font-mono text-sm mb-2 block">
              {"// Get In Touch"}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              Let&apos;s <span className="text-gradient">Connect</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00C9FF] to-[#FFB800] mx-auto rounded-full mb-6" />
            <p className="text-muted-foreground max-w-lg mx-auto">
              Have a project in mind or want to discuss opportunities? 
              I&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-2xl glass"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="glass border-[#00C9FF]/20 focus:border-[#00C9FF] bg-transparent transition-all duration-300"
                      />
                      {/* Cyan underline animation on focus */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === 'name' ? 1 : 0 }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C9FF] origin-left"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="glass border-[#00C9FF]/20 focus:border-[#00C9FF] bg-transparent transition-all duration-300"
                      />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: focusedField === 'email' ? 1 : 0 }}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C9FF] origin-left"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <div className="relative">
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this about?"
                      required
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className="glass border-[#00C9FF]/20 focus:border-[#00C9FF] bg-transparent transition-all duration-300"
                    />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === 'subject' ? 1 : 0 }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C9FF] origin-left"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      rows={5}
                      required
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="glass border-[#00C9FF]/20 focus:border-[#00C9FF] bg-transparent resize-none transition-all duration-300"
                    />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: focusedField === 'message' ? 1 : 0 }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C9FF] origin-left"
                    />
                  </div>
                </div>
                
                {/* Submit button with circuit trace border animation */}
                <div className="relative group">
                  <Button
                    type="submit"
                    disabled={isSubmitting || submitted}
                    className="w-full glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-[#00C9FF]/10 hover:bg-[#00C9FF]/20 text-[#00C9FF] hover:shadow-[0_0_20px_rgba(0,201,255,0.3)] transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Radio className="mr-2 h-4 w-4 animate-pulse" />
                        Sending Signal...
                      </>
                    ) : submitted ? (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Message Transmitted!
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  
                  {/* Animated border trace on hover */}
                  <svg className="absolute inset-0 w-full h-full rounded-md overflow-visible pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <rect
                      x="0.5"
                      y="0.5"
                      width="calc(100% - 1px)"
                      height="calc(100% - 1px)"
                      rx="5"
                      fill="none"
                      stroke="#00C9FF"
                      strokeWidth="1"
                      strokeDasharray="200"
                      strokeDashoffset="200"
                      className="group-hover:animate-border-trace"
                    />
                  </svg>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl glass">
                <h3 className="text-lg font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="flex items-center gap-4 p-3 rounded-xl glass hover:shadow-[0_0_15px_rgba(0,201,255,0.2)] transition-all group"
                    >
                      <div 
                        className="p-2 rounded-lg transition-all group-hover:scale-110"
                        style={{ backgroundColor: `${link.color}20` }}
                      >
                        <link.icon className="h-5 w-5" style={{ color: link.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{link.label}</p>
                        <p className="text-sm font-medium group-hover:text-[#00C9FF] transition-colors">
                          {link.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-4 p-3 rounded-xl glass"
                  >
                    <div className="p-2 rounded-lg bg-[#FFB800]/20">
                      <MapPin className="h-5 w-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{profile.location}</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Availability Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="p-6 rounded-2xl glass border-[#00C9FF]/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-[#00C9FF]">Available for opportunities</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Currently open to internships, research positions, and collaborative projects 
                  in embedded systems, FPGA design, and IoT development.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
