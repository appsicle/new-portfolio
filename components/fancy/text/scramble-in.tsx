"use client"

import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"

interface ScrambleInProps {
  text: string
  scrambleSpeed?: number
  scrambledLetterCount?: number
  characters?: string
  className?: string
  scrambledClassName?: string
  autoStart?: boolean
  onStart?: () => void
  onComplete?: () => void
}

export interface ScrambleInHandle {
  start: () => void
  reset: () => void
}

const ScrambleIn = forwardRef<ScrambleInHandle, ScrambleInProps>(
  (
    {
      text,
      scrambleSpeed = 50,
      scrambledLetterCount = 2,
      characters = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
      className = "",
      scrambledClassName = "",
      autoStart = true,
      onStart,
      onComplete,
    },
    ref
  ) => {
    const [displayText, setDisplayText] = useState("")
    const [isAnimating, setIsAnimating] = useState(false)
    const [visibleLetterCount, setVisibleLetterCount] = useState(0)
    const [scrambleOffset, setScrambleOffset] = useState(0)

    const startAnimation = useCallback(() => {
      setIsAnimating(true)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      onStart?.()
    }, [onStart])

    const reset = useCallback(() => {
      setIsAnimating(false)
      setVisibleLetterCount(0)
      setScrambleOffset(0)
      setDisplayText("")
    }, [])

    useImperativeHandle(ref, () => ({
      start: startAnimation,
      reset,
    }))

    useEffect(() => {
      if (autoStart) {
        startAnimation()
      }
    }, [autoStart, startAnimation])

    useEffect(() => {
      let interval: NodeJS.Timeout

      if (isAnimating) {
        interval = setInterval(() => {
          // Increase visible text length
          if (visibleLetterCount < text.length) {
            setVisibleLetterCount((prev) => prev + 1)
          }
          // Start sliding scrambled text out
          else if (scrambleOffset < scrambledLetterCount) {
            setScrambleOffset((prev) => prev + 1)
          }
          // Complete animation
          else {
            clearInterval(interval)
            setIsAnimating(false)
            onComplete?.()
          }

          // Calculate how many scrambled letters we can show
          const remainingSpace = Math.max(0, text.length - visibleLetterCount)
          const currentScrambleCount = Math.min(
            remainingSpace,
            scrambledLetterCount
          )

          // Generate scrambled text
          const scrambledPart = Array(currentScrambleCount)
            .fill(0)
            .map(
              () => characters[Math.floor(Math.random() * characters.length)]
            )
            .join("")

          setDisplayText(text.slice(0, visibleLetterCount) + scrambledPart)
        }, scrambleSpeed)
      }

      return () => {
        if (interval) clearInterval(interval)
      }
    }, [
      isAnimating,
      text,
      visibleLetterCount,
      scrambleOffset,
      scrambledLetterCount,
      characters,
      scrambleSpeed,
      onComplete,
    ])

    // Each character gets a slot sized by its final glyph (invisible), with the
    // currently displayed character absolutely overlaid — the text never moves,
    // so the animation produces zero layout shift. Characters are grouped by
    // word so line breaks only occur at spaces.
    const renderChar = (ch: string, i: number) => {
      const shown = i < displayText.length ? displayText[i] : null
      const isRevealed = i < visibleLetterCount
      return (
        <span key={i} className="relative inline-block">
          <span className="invisible">{ch}</span>
          {shown !== null && (
            <span
              className={`absolute inset-0 ${
                isRevealed ? className : scrambledClassName
              }`}
            >
              {shown}
            </span>
          )}
        </span>
      )
    }

    let charIndex = 0
    const tokens = text.split(/(\s+)/).filter(Boolean)

    return (
      <span className="inline-block whitespace-pre-wrap">
        <span aria-hidden="true">
          {tokens.map((token, t) => {
            const start = charIndex
            charIndex += token.length
            const chars = token
              .split("")
              .map((ch, j) => renderChar(ch, start + j))
            return /\s/.test(token[0]) ? (
              <Fragment key={`s-${t}`}>{chars}</Fragment>
            ) : (
              <span key={`w-${t}`} className="inline-block whitespace-nowrap">
                {chars}
              </span>
            )
          })}
        </span>
        <span className="sr-only">{text}</span>
      </span>
    )
  }
)

ScrambleIn.displayName = "ScrambleIn"
export default ScrambleIn
