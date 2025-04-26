"use client"

import { useEffect } from "react"
import { usePlayerStore } from "@/lib/store"
import SearchBar from "./search-bar"
import SearchResults from "./search-results"
import AudioPlayer from "./audio-player"
import DebugPanel from "./debug-panel"
import { Bug } from "lucide-react"

export default function MusicPlayer() {
  const { toggleDebugMode, debugMode, addDebugLog, setBackendAvailable } = usePlayerStore()

  useEffect(() => {
    addDebugLog("Music player initialized", "info")

    // Check if the backend is available
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:8000/search?q=test", {
          signal: AbortSignal.timeout(5000), // Timeout after 5 seconds
        })

        if (response.ok) {
          addDebugLog("Backend is available", "info")
          setBackendAvailable(true)
        } else {
          addDebugLog("Backend returned an error, using mock data", "warning")
          setBackendAvailable(false)
        }
      } catch (error) {
        addDebugLog("Backend is not available, using mock data", "warning")
        setBackendAvailable(false)
      }
    }

    checkBackend()

    // Add keyboard shortcut for debug mode (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        toggleDebugMode()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [addDebugLog, toggleDebugMode, setBackendAvailable])

  return (
    <div className="w-full flex flex-col items-center">
      <SearchBar />
      <SearchResults />
      <AudioPlayer />
      <DebugPanel />

      <button
        onClick={toggleDebugMode}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 rounded-full opacity-50 hover:opacity-100"
        title="Toggle Debug Mode (Ctrl+Shift+D)"
      >
        <Bug className="h-5 w-5" />
      </button>
    </div>
  )
}
