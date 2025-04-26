"use client";

import AudioPlayer from "./audio-player";
import { usePlayerStore } from "@/lib/store";
import AnimatedThumbnail from "./animated-thumbnail";
import RightBgFlash from "./right-bg-flash";

export default function MusicPlayerRight() {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden">
      <RightBgFlash triggerKey={currentTrack?.id} />
      {currentTrack ? (
        <>
          <div className="mb-6 relative z-10">
            <AnimatedThumbnail
              src={currentTrack.thumbnail || "/placeholder.svg?height=256&width=256"}
              alt={currentTrack.title}
              keyTrigger={currentTrack.id}
              onceOnly
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center relative z-10">{currentTrack.title}</h2>
          <p className="text-lg text-gray-300 mb-4 text-center relative z-10">{currentTrack.artist}</p>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            {/* Play/Pause, Add to Playlist, Volume */}
            <AudioPlayer />
            <button className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 text-white text-xl" title="Add to Playlist">
              <span role="img" aria-label="Add to Playlist">★</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center relative z-10">No track selected</div>
      )}
    </div>
  );
}
