"use client"

import { useEffect, useRef, useState, ElementType } from "react"

interface TextEffectProps {
  text: string
  hoverText?: string
  href?: string
  className?: string
  delay?: number
  /** Render as any HTML tag — default "h1". Use "span" for inline use. */
  as?: ElementType
  glowColor?: string
}

export function TextGlitch({
  text,
  hoverText,
  href,
  className = "",
  delay = 0,
  as: Tag = "h1",
  glowColor = "#FFFF02",
}: TextEffectProps) {
  const textRef = useRef<HTMLElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(text)
  const [displayHoverText, setDisplayHoverText] = useState(hoverText || text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  // Re-sync when text prop changes (e.g. cycling words)
  useEffect(() => {
    setDisplayText(text)
    setDisplayHoverText(hoverText || text)
  }, [text, hoverText])

const handleMouseEnter = () => {
    if (hoverText) {
      let iteration = 0
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
      hoverIntervalRef.current = setInterval(() => {
        setDisplayHoverText(
          hoverText
            .split("")
            .map((letter, index) => {
              if (index < iteration) return hoverText[index]
              return letters[Math.floor(Math.random() * 26)]
            })
            .join(""),
        )
        if (iteration >= hoverText.length) clearInterval(hoverIntervalRef.current!)
        iteration += 1 / 3
      }, 30)
    }
    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
  }

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    setDisplayHoverText(hoverText || text)
    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)"
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    }
  }, [])

  const spanContent = hoverText ? (
    href ? (
      <a href={href} target="_blank" rel="noreferrer" className="no-underline text-inherit">
        {displayHoverText}
      </a>
    ) : (
      displayHoverText
    )
  ) : (
    text
  )

  return (
    <Tag
      ref={textRef}
      className={`
        font-bold leading-none tracking-tight m-0
        bg-clip-text bg-no-repeat
        relative inline-block
        transition-all duration-500 ease-out
        cursor-pointer
        overflow-hidden
        ${className}
      `}
      style={{
        backgroundSize: "0%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        wordBreak: "break-word",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
      <span
        ref={spanRef}
        className="
          absolute inset-0 w-full h-full
          font-bold
          flex items-center
          transition-all duration-[400ms] ease-out
          pointer-events-none
          overflow-hidden
        "
        style={{
          clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
          transformOrigin: "center",
          backgroundColor: glowColor,
          color: "#002147",
          whiteSpace: "nowrap",
        }}
      >
        {spanContent}
      </span>
    </Tag>
  )
}
