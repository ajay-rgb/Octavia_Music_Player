"use client"

import { usePlayerStore } from "@/lib/store"
import TrackItem from "./track-item"

export default function SearchResults() {
  const { searchResults, isSearching, searchError } = usePlayerStore()

  if (isSearching) {
    return (
      <div className="w-full max-w-3xl mt-8 text-center">
        <div className="h-10 w-10 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto"></div>
        <p className="mt-4">Searching...</p>
      </div>
    )
  }

  if (searchError) {
    return (
      <div className="w-full max-w-3xl mt-8 text-center bg-red-900 bg-opacity-50 p-4 rounded-xl">
        <p className="text-white">Error: {searchError}</p>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-3xl mt-8">
      {searchResults.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  )
}
