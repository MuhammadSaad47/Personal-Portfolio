"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, FileText, Briefcase, GraduationCap, Code2, 
  Plus, Trash2, Save, LogOut, Upload, X,
  FolderOpen, Cpu, Settings, ChevronRight, Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import initialContent from "@/data/content.json"

const ADMIN_PASSWORD = "saad2024" // In production, use env variable

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

interface Skill {
  name: string
  level: number
}

interface Education {
  id: string
  institution: string
  degree: string
  period: string
  status: string
  coursework: string[]
}

interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
  isPlaceholder?: boolean
}

interface ContentData {
  profile: {
    name: string
    titles: string[]
    email: string
    github: string
    linkedin: string
    location: string
    university: string
    degree: string
    bio: string
    profileImage: string
    resumeUrl: string
  }
  specializations: string[]
  skills: {
    languages: Skill[]
    libraries: Skill[]
    hardware: Skill[]
    domains: Skill[]
  }
  projects: Project[]
  education: Education[]
  experience: Experience[]
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "files", label: "Files", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
]

const proficiencyLevels = [
  { value: "expert", label: "Expert", range: "85-100" },
  { value: "proficient", label: "Proficient", range: "60-84" },
  { value: "familiar", label: "Familiar", range: "30-59" },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [content, setContent] = useState<ContentData>(initialContent)
  const loadedContentRef = useRef<ContentData>(initialContent)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isDirty = JSON.stringify(content) !== JSON.stringify(loadedContentRef.current)

  const profileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500 * 1024) {
      alert("Profile image size exceeds 500KB limit!")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        updateProfile("profileImage", base64)
        alert("Profile image uploaded successfully! Save changes to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume PDF size exceeds 5MB limit!")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        updateProfile("resumeUrl", base64)
        alert("Resume PDF uploaded successfully! Save changes to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleProfileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith("image/")) {
      alert("Please drop a valid image file.")
      return
    }
    
    if (file.size > 500 * 1024) {
      alert("Profile image size exceeds 500KB limit!")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        updateProfile("profileImage", base64)
        alert("Profile image uploaded successfully! Save changes to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || file.type !== "application/pdf") {
      alert("Please drop a valid PDF file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume PDF size exceeds 5MB limit!")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        updateProfile("resumeUrl", base64)
        alert("Resume PDF uploaded successfully! Save changes to apply.")
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
    
    // Load dynamically from database API route
    fetch("/api/content")
      .then((res) => {
        if (!res.ok) throw new Error("API load failed")
        return res.json()
      })
      .then((data) => {
        if (data && !data.error) {
          setContent(data)
          loadedContentRef.current = data
        }
      })
      .catch((err) => {
        console.error("Failed to load content from API, falling back to local storage cache:", err)
        const savedContent = localStorage.getItem("portfolio_content")
        if (savedContent) {
          try {
            const parsed = JSON.parse(savedContent)
            setContent(parsed)
            loadedContentRef.current = parsed
          } catch (e) {
            console.error("Failed to parse fallback cache content", e)
          }
        } else {
          loadedContentRef.current = initialContent
        }
      })
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_auth", "true")
      setError("")
    } else {
      setError("Invalid password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_auth")
  }

  const saveContent = async () => {
    // Keep local storage as local cache/backup
    localStorage.setItem("portfolio_content", JSON.stringify(content))
    
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })
      
      if (!res.ok) {
        throw new Error("Server failed to save")
      }
      
      loadedContentRef.current = content
      setSaved(true)
    } catch (err) {
      console.error("Failed to save to database:", err)
      alert("Failed to save changes to server database! Local storage cache updated.")
    } finally {
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const updateProfile = (field: string, value: string | string[]) => {
    setContent((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }))
  }

  const addProject = () => {
    if (content.projects.length >= 25) return
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      description: "Project description",
      tags: ["Tag1"],
      category: "Software",
      github: "",
      live: "",
      thumbnail: "",
    }
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }))
  }

  const updateProject = (id: string, field: string, value: string | string[]) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }))
  }

  const deleteProject = (id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }))
  }

  const updateSkill = (
    category: keyof ContentData["skills"],
    index: number,
    field: "name" | "level",
    value: string | number
  ) => {
    setContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].map((s, i) =>
          i === index ? { ...s, [field]: value } : s
        ),
      },
    }))
  }

  const addSkill = (category: keyof ContentData["skills"]) => {
    setContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], { name: "New Skill", level: 70 }],
      },
    }))
  }

  const deleteSkill = (category: keyof ContentData["skills"], index: number) => {
    setContent((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index),
      },
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "New Institution",
      degree: "Degree Name",
      period: "2024 - Present",
      status: "Current",
      coursework: ["Course 1"],
    }
    setContent((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }))
  }

  const updateEducation = (id: string, field: string, value: string | string[]) => {
    setContent((prev) => ({
      ...prev,
      education: prev.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }))
  }

  const deleteEducation = (id: string) => {
    setContent((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }))
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "Company Name",
      position: "Position Title",
      period: "2024 - Present",
      description: "Job description",
      isPlaceholder: false,
    }
    setContent((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }))
  }

  const deleteExperience = (id: string) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }))
  }

  const getProficiencyLabel = (level: number) => {
    if (level >= 85) return "Expert"
    if (level >= 60) return "Proficient"
    return "Familiar"
  }

  // Login Screen with glassmorphism
  if (!isAuthenticated) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-[#040D18] p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00C9FF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B61FF]/10 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="p-8 rounded-2xl glass">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-xl bg-[#00C9FF]/10 border border-[#00C9FF]/30 flex items-center justify-center mb-4">
                <Cpu className="h-8 w-8 text-[#00C9FF]" />
              </div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-white">
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-2">
                Enter password to access the portfolio dashboard
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="glass border-[#00C9FF]/20 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500"
                />
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-[#00C9FF]/10 hover:bg-[#00C9FF]/20 text-[#00C9FF] hover:shadow-[0_0_20px_rgba(0,201,255,0.3)]"
              >
                Login
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="dark min-h-screen bg-[#040D18] text-white flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        className="fixed left-0 top-0 bottom-0 glass-strong bg-[#040D18]/95 border-r border-[#00C9FF]/20 z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#00C9FF]/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#00C9FF]/10 border border-[#00C9FF]/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5 text-[#00C9FF]" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold font-[family-name:var(--font-space-grotesk)] text-gradient whitespace-nowrap"
              >
                Admin Panel
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-[#00C9FF]/20 text-[#00C9FF] border border-[#00C9FF]/30"
                  : "hover:bg-[#00C9FF]/10 text-muted-foreground hover:text-white"
              }`}
            >
              <tab.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
        
        {/* Sidebar toggle & logout */}
        <div className="p-2 border-t border-[#00C9FF]/20 space-y-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#00C9FF]/10 text-muted-foreground hover:text-white transition-all"
          >
            <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 glass-strong bg-[#040D18]/90 border-b border-[#00C9FF]/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your portfolio content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="glass border-[#7B61FF]/50 hover:border-[#7B61FF] text-[#7B61FF]"
            >
              <a href="/" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </a>
            </Button>
            <Button
              onClick={saveContent}
              size="sm"
              className={`glass transition-all duration-300 ${
                saved 
                  ? "border-green-500/50 text-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                  : isDirty
                    ? "border-[#FFB800] text-[#FFB800] bg-[#FFB800]/15 shadow-[0_0_20px_rgba(255,184,0,0.25)] animate-pulse"
                    : "border-[#00C9FF]/50 hover:border-[#00C9FF] bg-[#00C9FF]/10 hover:bg-[#00C9FF]/20 text-[#00C9FF]"
              }`}
            >
              <Save className="h-4 w-4 mr-2" />
              {saved ? "Saved!" : isDirty ? "Save Changes *" : "Save Changes"}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="p-6 rounded-xl glass space-y-4">
                <h3 className="font-semibold text-[#00C9FF]">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <Input
                      value={content.profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <Input
                      value={content.profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <Input
                      value={content.profile.location}
                      onChange={(e) => updateProfile("location", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">University</Label>
                    <Input
                      value={content.profile.university}
                      onChange={(e) => updateProfile("university", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Degree</Label>
                    <Input
                      value={content.profile.degree}
                      onChange={(e) => updateProfile("degree", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl glass space-y-4">
                <h3 className="font-semibold text-[#00C9FF]">Social Links</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">GitHub URL</Label>
                    <Input
                      value={content.profile.github}
                      onChange={(e) => updateProfile("github", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">LinkedIn URL</Label>
                    <Input
                      value={content.profile.linkedin}
                      onChange={(e) => updateProfile("linkedin", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl glass space-y-4 lg:col-span-2">
                <h3 className="font-semibold text-[#00C9FF]">Bio</h3>
                <Textarea
                  value={content.profile.bio}
                  onChange={(e) => updateProfile("bio", e.target.value)}
                  rows={4}
                  className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="p-6 rounded-xl glass space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#00C9FF]">Titles (Typewriter Loop)</h3>
                    <p className="text-sm text-muted-foreground">These cycle in the hero section</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => updateProfile("titles", [...content.profile.titles, "New Title"])}
                    className="glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-transparent text-[#00C9FF]"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {content.profile.titles.map((title, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={title}
                        onChange={(e) => {
                          const newTitles = [...content.profile.titles]
                          newTitles[index] = e.target.value
                          updateProfile("titles", newTitles)
                        }}
                        className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newTitles = content.profile.titles.filter((_, i) => i !== index)
                          updateProfile("titles", newTitles)
                        }}
                        className="hover:bg-red-500/10 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="grid gap-6 md:grid-cols-2">
              {(Object.keys(content.skills) as Array<keyof typeof content.skills>).map((category) => (
                <div key={category} className="p-6 rounded-xl glass space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#00C9FF] capitalize">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => addSkill(category)}
                      className="glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-transparent text-[#00C9FF]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {content.skills[category].map((skill, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(category, index, "name", e.target.value)}
                          className="flex-1 glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500"
                        />
                        <Select
                          value={skill.level >= 85 ? "expert" : skill.level >= 60 ? "proficient" : "familiar"}
                          onValueChange={(val) => {
                            const levelMap = { expert: 90, proficient: 75, familiar: 45 }
                            updateSkill(category, index, "level", levelMap[val as keyof typeof levelMap])
                          }}
                        >
                          <SelectTrigger className="w-32 glass border-border/50 bg-[#0a1628]/80 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-[#00C9FF]/20 bg-[#0a1628] text-white">
                            {proficiencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value} className="text-white hover:text-white focus:text-white">
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSkill(category, index)}
                          className="hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {content.projects.length} / 25 projects
                </p>
                <Button 
                  onClick={addProject} 
                  disabled={content.projects.length >= 25}
                  className="glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-[#00C9FF]/10 text-[#00C9FF]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content.projects.map((project) => (
                  <div key={project.id} className="p-4 rounded-xl glass space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-[#00C9FF] line-clamp-1">{project.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProject(project.id)}
                        className="hover:bg-red-500/10 hover:text-red-400 -mr-2 -mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Title"
                      value={project.title}
                      onChange={(e) => updateProject(project.id, "title", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 text-sm"
                    />
                    <Textarea
                      placeholder="Description"
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      rows={2}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 text-sm"
                    />
                    <Select
                      value={project.category}
                      onValueChange={(val) => updateProject(project.id, "category", val)}
                    >
                      <SelectTrigger className="glass border-border/50 bg-[#0a1628]/80 text-white text-sm">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="glass border-[#00C9FF]/20 bg-[#0a1628] text-white">
                        <SelectItem value="Hardware" className="text-white hover:text-white focus:text-white">Hardware</SelectItem>
                        <SelectItem value="Software" className="text-white hover:text-white focus:text-white">Software</SelectItem>
                        <SelectItem value="IoT" className="text-white hover:text-white focus:text-white">IoT</SelectItem>
                        <SelectItem value="Full-Stack" className="text-white hover:text-white focus:text-white">Full-Stack</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Tags (comma-separated)"
                      value={project.tags.join(", ")}
                      onChange={(e) =>
                        updateProject(project.id, "tags", e.target.value.split(",").map((t) => t.trim()))
                      }
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 text-sm"
                    />
                    <Input
                      placeholder="GitHub URL"
                      value={project.github}
                      onChange={(e) => updateProject(project.id, "github", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 text-sm"
                    />
                    <Input
                      placeholder="Live URL"
                      value={project.live}
                      onChange={(e) => updateProject(project.id, "live", e.target.value)}
                      className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 text-sm"
                    />
                    
                    {/* Project Thumbnail Image Uploader */}
                    <div className="space-y-1.5 pt-1">
                      <Label className="text-xs text-muted-foreground font-medium">Project Image</Label>
                      <div className="flex gap-2 items-center">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt="Project thumbnail" 
                            className="w-12 h-8 object-cover rounded border border-[#00C9FF]/30 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-8 bg-[#0a1628] border border-dashed border-muted-foreground/30 rounded flex items-center justify-center shrink-0">
                            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            if (file.size > 500 * 1024) {
                              alert("Project image size exceeds 500KB limit!")
                              return
                            }
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string
                              if (base64) {
                                updateProject(project.id, "thumbnail", base64)
                              }
                            }
                            reader.readAsDataURL(file)
                          }}
                          className="hidden"
                          id={`project-file-${project.id}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`project-file-${project.id}`)?.click()}
                          className="glass border-border/50 text-[11px] h-8 px-2.5 flex-1 justify-center animate-none"
                        >
                          Upload Image
                        </Button>
                        {project.thumbnail && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => updateProject(project.id, "thumbnail", "")}
                            className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400 shrink-0"
                            aria-label="Remove image"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={addEducation}
                  className="glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-[#00C9FF]/10 text-[#00C9FF]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-4">
                {content.education.map((edu) => (
                  <div key={edu.id} className="p-6 rounded-xl glass">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-[#00C9FF]">{edu.degree}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEducation(edu.id)}
                        className="hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-muted-foreground">Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Period</Label>
                        <Input
                          value={edu.period}
                          onChange={(e) => updateEducation(edu.id, "period", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Input
                          value={edu.status}
                          onChange={(e) => updateEducation(edu.id, "status", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Coursework (comma-separated)</Label>
                        <Input
                          value={edu.coursework.join(", ")}
                          onChange={(e) =>
                            updateEducation(edu.id, "coursework", e.target.value.split(",").map((c) => c.trim()))
                          }
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={addExperience}
                  className="glass border-[#00C9FF]/50 hover:border-[#00C9FF] bg-[#00C9FF]/10 text-[#00C9FF]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <div className="space-y-4">
                {content.experience.map((exp) => (
                  <div key={exp.id} className="p-6 rounded-xl glass">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-[#00C9FF]">{exp.position}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExperience(exp.id)}
                        className="hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-muted-foreground">Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Period</Label>
                        <Input
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          checked={exp.isPlaceholder || false}
                          onChange={(e) => updateExperience(exp.id, "isPlaceholder", e.target.checked)}
                          className="rounded border-border accent-[#00C9FF] bg-[#0a1628]"
                        />
                        <Label className="text-muted-foreground">Placeholder (seeking opportunities)</Label>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          rows={2}
                          className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === "files" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-xl glass space-y-4">
                <h3 className="font-semibold text-[#00C9FF]">Profile Image</h3>
                <div 
                  onClick={() => profileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleProfileDrop}
                  className="cursor-pointer border-2 border-dashed border-[#00C9FF]/30 rounded-xl p-8 text-center hover:border-[#00C9FF]/60 hover:bg-[#00C9FF]/5 transition-all duration-300"
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-white font-medium">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 500KB, JPG or PNG
                  </p>
                  <input 
                    type="file" 
                    ref={profileInputRef}
                    onChange={handleProfileImageChange}
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                {content.profile.profileImage && (
                  <div className="mt-4 p-3 rounded-lg bg-[#0a1628]/60 border border-[#00C9FF]/20 flex items-center gap-4">
                    <img 
                      src={content.profile.profileImage.startsWith("data:") ? content.profile.profileImage : content.profile.profileImage} 
                      alt="Profile preview" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#00C9FF]/30" 
                    />
                    <div>
                      <p className="text-xs text-[#00C9FF] font-semibold">Active Profile Image</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                        {content.profile.profileImage.startsWith("data:") ? "Base64 Encoded Stream" : content.profile.profileImage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 rounded-xl glass space-y-4">
                <h3 className="font-semibold text-[#FFB800]">Resume PDF</h3>
                <div 
                  onClick={() => resumeInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleResumeDrop}
                  className="cursor-pointer border-2 border-dashed border-[#FFB800]/30 rounded-xl p-8 text-center hover:border-[#FFB800]/60 hover:bg-[#FFB800]/5 transition-all duration-300"
                >
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-white font-medium">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF only, max 5MB
                  </p>
                  <input 
                    type="file" 
                    ref={resumeInputRef}
                    onChange={handleResumeChange}
                    accept=".pdf" 
                    className="hidden" 
                  />
                </div>
                {content.profile.resumeUrl && (
                  <div className="mt-4 p-3 rounded-lg bg-[#0a1628]/60 border border-[#FFB800]/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#FFB800]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#FFB800] font-semibold">Active Resume PDF</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                        {content.profile.resumeUrl.startsWith("data:") ? "Base64 Encoded PDF" : content.profile.resumeUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-xl space-y-6">
              <div className="p-6 rounded-xl glass space-y-4">
                <h3 className="font-semibold text-[#00C9FF]">Contact Email</h3>
                <Input
                  value={content.profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                  className="glass border-border/50 focus:border-[#00C9FF] bg-[#0a1628]/80 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="p-6 rounded-xl glass space-y-4">
                <h3 className="font-semibold text-[#FFB800]">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  These actions are irreversible. Use with caution.
                </p>
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all content to defaults?")) {
                      setContent(initialContent)
                      loadedContentRef.current = initialContent
                      localStorage.removeItem("portfolio_content")
                    }
                  }}
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Unsaved Changes Notification */}
        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 50, x: "-50%" }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 px-6 py-4 rounded-xl glass border-[#FFB800]/40 shadow-[0_10px_30px_rgba(255,184,0,0.25)] bg-[#0a1628]/95 max-w-md w-[90%] sm:w-auto"
            >
              <div className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB800] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFB800]"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#FFB800]">Unsaved Changes</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  You have unsaved changes in your dashboard.
                </p>
              </div>
              <Button
                size="sm"
                onClick={saveContent}
                className="glass border-[#FFB800]/50 hover:border-[#FFB800] bg-[#FFB800]/10 hover:bg-[#FFB800]/25 text-[#FFB800] hover:shadow-[0_0_15px_rgba(255,184,0,0.3)] transition-all font-semibold shrink-0"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
