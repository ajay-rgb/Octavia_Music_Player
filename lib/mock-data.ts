import type { Track } from "./store"

// Mock data for when the backend is unavailable
export const getMockSearchResults = (query: string): Track[] => {
  // Generate some mock tracks based on the search query
  return [
    {
      id: "dQw4w9WgXcQ",
      title: `${query} - Top Hit`,
      artist: "Various Artists",
      thumbnail: "/placeholder.svg?height=64&width=64",
      duration: "3:45",
    },
    {
      id: "xTlNMmZKwpA",
      title: `${query} Remix`,
      artist: "DJ Example",
      thumbnail: "/placeholder.svg?height=64&width=64",
      duration: "4:27",
    },
    {
      id: "JFm7YDVlqnI",
      title: `Best of ${query}`,
      artist: "Music Compilation",
      thumbnail: "/placeholder.svg?height=64&width=64",
      duration: "3:38",
    },
  ]
}

// Mock download progress
export const getMockDownloadProgress = (trackId: string, requestId: string) => {
  // Return a mock download progress object
  return {
    phase: "ready",
    progress: 100,
    videoId: trackId,
    file_path: `/mock-audio/${trackId}.mp3`,
  }
}

// Generate a mock request ID
export const generateMockRequestId = () => {
  return `mock-${Math.random().toString(36).substring(2, 15)}`
}
