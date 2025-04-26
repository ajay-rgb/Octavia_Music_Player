"use client";

import AudioPlayer from "./audio-player";
import { usePlayerStore } from "@/lib/store";

export default function MusicPlayerRight() {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {currentTrack ? (
        <>
          <div className="mb-6">
            <img
              src={currentTrack.thumbnail || "/placeholder.svg?height=256&width=256"}
              alt={currentTrack.title}
              className="rounded-2xl shadow-lg object-cover"
              width={256}
              height={256}
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">{currentTrack.title}</h2>
          <p className="text-lg text-gray-300 mb-4 text-center">{currentTrack.artist}</p>
          <div className="flex items-center gap-4 mb-6">
            {/* Play/Pause, Add to Playlist, Volume */}
            <AudioPlayer />
            <button className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white text-xl" title="Add to Playlist">
              <span role="img" aria-label="Add to Playlist">★</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center">No track selected</div>
      )}
    </div>
  );
}
