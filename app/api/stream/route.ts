import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId");
  const requestId = req.nextUrl.searchParams.get("requestId");

  if (!videoId || !requestId) {
    return new Response("Missing videoId or requestId", { status: 400 });
  }

  const backendUrl = `http://localhost:8000/stream_audio?videoId=${encodeURIComponent(videoId)}&requestId=${encodeURIComponent(requestId)}`;

  const backendResponse = await fetch(backendUrl);

  if (!backendResponse.ok) {
    return new Response("Failed to fetch audio from backend", { status: backendResponse.status });
  }

  const headers = new Headers(backendResponse.headers);
  // Optionally, filter or adjust headers for streaming

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers,
  });
}
