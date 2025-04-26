import { type NextRequest, NextResponse } from "next/server"
import { getMockDownloadProgress } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const requestId = searchParams.get("requestId")
  const videoId = searchParams.get("videoId") || ""

  if (!requestId) {
    return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
  }

  try {
    // Try to call our local backend API
    try {
      const response = await fetch(`http://localhost:8000/progress?requestId=${requestId}`, {
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
    // Extract videoId from requestId if it's a mock requestId
    const mockVideoId = requestId.startsWith("mock-") && videoId ? videoId : requestId.split("-")[1] || "unknown"
    const mockProgress = getMockDownloadProgress(mockVideoId, requestId)
    return NextResponse.json(mockProgress)
  } catch (error) {
    console.error("Progress API error:", error)
    return NextResponse.json(
      { error: "Failed to check progress", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
