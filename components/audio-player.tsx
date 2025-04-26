"use client"

import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/lib/store"
import MockAudioPlayer from "./mock-audio-player"

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    setCurrentTime,
    setVolume,
    volume,
    requestIds,
    downloadProgress,
    addDebugLog,
    backendAvailable,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)

  // All hooks are called unconditionally at the top
  useEffect(() => {
    if (!audioRef.current) return

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleVolumeChange = () => {
      if (audioRef.current) {
        setVolume(audioRef.current.volume)
      }
    }

    const handleError = (e: ErrorEvent) => {
      addDebugLog(`Audio playback error: ${e.message}`, "error")
    }

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
    audioRef.current.addEventListener("volumechange", handleVolumeChange)
    audioRef.current.addEventListener("error", handleError as EventListener)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        audioRef.current.removeEventListener("volumechange", handleVolumeChange)
        audioRef.current.removeEventListener("error", handleError as EventListener)
      }
    }
  }, [setCurrentTime, setVolume, addDebugLog])

  useEffect(() => {
    if (!audioRef.current) return

    const trackId = currentTrack?.id
    const requestId = trackId ? requestIds[trackId] : undefined
    const progress = trackId ? downloadProgress[trackId] : undefined

    if (currentTrack && requestId && (progress?.phase === "ready" || progress?.phase === "done")) {
      // Set the audio source when the track is ready
      audioRef.current.src = `/api/stream?videoId=${trackId}&requestId=${requestId}`
      audioRef.current.load()
      addDebugLog(`Audio source set for track: ${currentTrack.title}`, "info")
    } else {
      // Ensure src is cleared if conditions are not met to prevent unexpected behavior
      audioRef.current.src = ""
    }
  }, [currentTrack, requestIds, downloadProgress, addDebugLog])

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          addDebugLog(`Play error: ${error.message}`, "error")
        })
      }
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, addDebugLog])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Now conditionally render the UI
  if (!backendAvailable) {
    return <MockAudioPlayer />
  }
  return <audio ref={audioRef} />
}

