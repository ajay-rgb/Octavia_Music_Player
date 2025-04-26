"use client"

import { useEffect, useRef, useState } from "react"
import { usePlayerStore } from "@/lib/store"

export default function MockAudioPlayer() {
  const { currentTrack, isPlaying, setCurrentTime, addDebugLog } = usePlayerStore()
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate audio playback with a timer
  useEffect(() => {
    if (isPlaying && currentTrack) {
      addDebugLog("Mock audio playback started", "info")

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Start a new interval to update progress
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1
          setCurrentTime(newProgress)

          // If we reach 100%, stop the interval
          if (newProgress >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            return 0
          }

          return newProgress
        })
      }, 1000)
    } else {
      // If not playing, clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        addDebugLog("Mock audio playback paused", "info")
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, currentTrack, setCurrentTime, addDebugLog])

  return null
}
