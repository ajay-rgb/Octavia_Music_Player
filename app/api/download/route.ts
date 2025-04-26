import { type NextRequest, NextResponse } from "next/server"
import { generateMockRequestId } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId } = body

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    // Try to call our local backend API
    try {
      const response = await fetch(`http://localhost:8000/download_and_stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
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
    const mockRequestId = generateMockRequestId()
    return NextResponse.json({ requestId: mockRequestId })
  } catch (error) {
    console.error("Download API error:", error)
    return NextResponse.json(
      { error: "Failed to initiate download", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
