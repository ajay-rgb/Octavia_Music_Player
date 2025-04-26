"use client"

import type React from "react"
import { usePlayerStore } from "@/lib/store"
import { Search } from "lucide-react"

export default function SearchBar() {
  const { searchQuery, setSearchQuery, search, isSearching } = usePlayerStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    search()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH BAR"
          className="w-full px-6 py-4 rounded-full text-black text-lg focus:outline-none focus:ring-2 focus:ring-white"
          disabled={isSearching}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
          disabled={isSearching}
        >
          <Search className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </form>
  )
}
