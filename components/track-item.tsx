"use client"

import { usePlayerStore, type Track } from "@/lib/store"
import { Play, Pause, AlertCircle } from "lucide-react"
import Image from "next/image"

interface TrackItemProps {
  track: Track
}

export default function TrackItem({ track }: TrackItemProps) {
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack, downloadProgress } = usePlayerStore()

  const isCurrentTrack = currentTrack?.id === track.id
  const progress = downloadProgress[track.id]

  const getBackgroundColor = () => {
    if (isCurrentTrack) {
      return "bg-red-900 bg-opacity-80"
    }
    return "bg-black bg-opacity-20 hover:bg-opacity-30"
  }

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        pauseTrack()
      } else {
        resumeTrack()
      }
    } else {
      playTrack(track)
    }
  }

  const renderPlaybackButton = () => {
    if (isCurrentTrack && progress?.phase === "error") {
      return (
        <button
          className="p-2 rounded-full bg-red-600 text-white"
          onClick={() => playTrack(track)} // Retry
          title={progress.error || "Error occurred"}
        >
          <AlertCircle className="h-6 w-6" />
        </button>
      )
    }

    if (isCurrentTrack && (progress?.phase === "downloading" || progress?.phase === "converting")) {
      return <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
    }

    return (
      <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30" onClick={handlePlayPause}>
        {isCurrentTrack && isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
      </button>
    )
  }

  return (
    <div className={`rounded-xl p-4 mb-4 transition-all ${getBackgroundColor()}`}>
      <div className="flex items-center">
        <div className="relative h-16 w-16 mr-4 rounded-md overflow-hidden">
          <Image
            src={track.thumbnail || "/placeholder.svg?height=64&width=64"}
            alt={track.title}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold">{track.title}</h3>
          <p className="text-gray-300">{track.artist}</p>

          {isCurrentTrack && progress && progress.phase !== "ready" && progress.phase !== "done" && (
            <div className="mt-2">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-400">
                {progress.phase === "downloading"
                  ? "Downloading..."
                  : progress.phase === "converting"
                    ? "Converting..."
                    : progress.phase === "error"
                      ? progress.error || "Error"
                      : "Preparing..."}
              </p>
            </div>
          )}
        </div>

        <div className="ml-4">{renderPlaybackButton()}</div>
      </div>

      {isCurrentTrack && (
        <div className="mt-4">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `50%` }} // This would be controlled by actual playback progress
            />
          </div>
        </div>
      )}
    </div>
  )
}
