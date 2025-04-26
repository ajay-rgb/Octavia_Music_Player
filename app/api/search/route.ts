import { type NextRequest, NextResponse } from "next/server"
import { getMockSearchResults } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    // Try to call our local backend API
    try {
      const response = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(query)}`, {
        signal: AbortSignal.timeout(3000), // Timeout after 3 seconds
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.warn("Backend unavailable, using mock data:", backendError)
    }

    // If backend is unavailable or returns an error, use mock data
    const mockResults = getMockSearchResults(query)
    return NextResponse.json({ results: mockResults })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Failed to search for tracks", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
