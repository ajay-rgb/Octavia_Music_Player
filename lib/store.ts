import { create } from "zustand"
import { devtools } from "zustand/middleware"

export type Track = {
  id: string
  title: string
  artist: string
  thumbnail: string
  duration: string
}

export type DownloadProgress = {
  phase: "queued" | "downloading" | "converting" | "ready" | "done" | "error"
  progress: number
  message?: string
  error?: string
}

export type PlayerState = {
  searchQuery: string
  searchResults: Track[]
  isSearching: boolean
  searchError: string | null

  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number

  downloadProgress: Record<string, DownloadProgress>
  requestIds: Record<string, string>

  debugMode: boolean
  debugLogs: Array<{ timestamp: number; message: string; type: "info" | "error" | "warning" }>

  backendAvailable: boolean
}

export type PlayerActions = {
  setSearchQuery: (query: string) => void
  search: () => Promise<void>
  clearSearch: () => void

  playTrack: (track: Track) => Promise<void>
  pauseTrack: () => void
  resumeTrack: () => void
  setCurrentTime: (time: number) => void
  setVolume: (volume: number) => void

  updateDownloadProgress: (trackId: string, progress: DownloadProgress) => void
  setRequestId: (trackId: string, requestId: string) => void

  toggleDebugMode: () => void
  addDebugLog: (message: string, type: "info" | "error" | "warning") => void
  clearDebugLogs: () => void

  setBackendAvailable: (available: boolean) => void
  pollDownloadProgress: (trackId: string, requestId: string) => void
}

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  devtools(
    (set, get) => ({
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      searchError: null,

      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,

      downloadProgress: {},
      requestIds: {},

      debugMode: false,
      debugLogs: [],

      backendAvailable: true,

      setSearchQuery: (query) => set({ searchQuery: query }),

      search: async () => {
        const { searchQuery } = get()
        if (!searchQuery.trim()) return

        set({ isSearching: true, searchError: null })
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
          if (!response.ok) throw new Error(`Search failed: ${response.statusText}`)

          const data = await response.json()

          // Check if we got an error from the API
          if (data.error) {
            throw new Error(data.error)
          }

          set({ searchResults: data.results, isSearching: false })
          get().addDebugLog(`Search completed: ${data.results.length} results`, "info")
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          set({ searchError: errorMessage, isSearching: false })
          get().addDebugLog(`Search error: ${errorMessage}`, "error")
        }
      },

      clearSearch: () => set({ searchQuery: "", searchResults: [] }),

      playTrack: async (track) => {
        const { currentTrack, requestIds } = get()

        // If already playing this track, just resume
        if (currentTrack?.id === track.id) {
          return get().resumeTrack()
        }

        set({ currentTrack: track, isPlaying: false })
        get().addDebugLog(`Starting playback for: ${track.title}`, "info")

        // Check if we already have a requestId for this track
        if (!requestIds[track.id]) {
          try {
            const response = await fetch("/api/download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ videoId: track.id }),
            })

            if (!response.ok) throw new Error(`Download request failed: ${response.statusText}`)

            const data = await response.json()

            // Check if we got an error from the API
            if (data.error) {
              throw new Error(data.error)
            }

            get().setRequestId(track.id, data.requestId)
            get().updateDownloadProgress(track.id, {
              phase: "queued",
              progress: 0,
            })
            get().addDebugLog(`Download initiated, requestId: ${data.requestId}`, "info")

            // Start polling for progress
            get().pollDownloadProgress(track.id, data.requestId)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            get().updateDownloadProgress(track.id, {
              phase: "error",
              progress: 0,
              error: errorMessage,
            })
            get().addDebugLog(`Download error: ${errorMessage}`, "error")
          }
        } else {
          // We already have a requestId, check if it's ready
          const progress = get().downloadProgress[track.id]
          if (progress && (progress.phase === "ready" || progress.phase === "done")) {
            set({ isPlaying: true })
          } else {
            // Start polling again
            get().pollDownloadProgress(track.id, requestIds[track.id])
          }
        }
      },

      pollDownloadProgress: async (trackId: string, requestId: string) => {
        const poll = async () => {
          try {
            const response = await fetch(`/api/progress?requestId=${requestId}&videoId=${trackId}`)
            if (!response.ok) throw new Error(`Progress check failed: ${response.statusText}`)

            const data = await response.json()

            // Check if we got an error from the API
            if (data.error) {
              throw new Error(data.error)
            }

            get().updateDownloadProgress(trackId, data)

            // If not done, poll again
            if (data.phase !== "ready" && data.phase !== "done" && data.phase !== "error") {
              setTimeout(poll, 1000)
            } else if (data.phase === "ready" || data.phase === "done") {
              // If ready and this is the current track, start playing
              const { currentTrack } = get()
              if (currentTrack?.id === trackId) {
                set({ isPlaying: true })
              }
              get().addDebugLog(`Track ready for playback: ${trackId}`, "info")
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            get().updateDownloadProgress(trackId, {
              phase: "error",
              progress: 0,
              error: errorMessage,
            })
            get().addDebugLog(`Progress polling error: ${errorMessage}`, "error")
          }
        }

        // Start polling
        poll()
      },

      pauseTrack: () => set({ isPlaying: false }),

      resumeTrack: () => set({ isPlaying: true }),

      setCurrentTime: (time) => set({ currentTime: time }),

      setVolume: (volume) => set({ volume: volume }),

      updateDownloadProgress: (trackId, progress) =>
        set((state) => ({
          downloadProgress: {
            ...state.downloadProgress,
            [trackId]: progress,
          },
        })),

      setRequestId: (trackId, requestId) =>
        set((state) => ({
          requestIds: {
            ...state.requestIds,
            [trackId]: requestId,
          },
        })),

      toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),

      addDebugLog: (message, type = "info") =>
        set((state) => ({
          debugLogs: [...state.debugLogs, { timestamp: Date.now(), message, type }].slice(-100), // Keep only the last 100 logs
        })),

      clearDebugLogs: () => set({ debugLogs: [] }),

      setBackendAvailable: (available) => set({ backendAvailable: available }),
    }),
    { name: "octavia-player-store" },
  ),
)
