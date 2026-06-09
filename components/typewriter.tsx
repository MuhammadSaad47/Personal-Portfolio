"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterProps {
  texts: string[]
  className?: string
}

export function Typewriter({ texts, className = "" }: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentTextIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(text.slice(0, currentText.length - 1))
          } else {
            setIsDeleting(false)
            setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, texts])

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  )
}
