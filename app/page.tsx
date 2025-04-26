import MusicPlayer from "@/components/music-player"

import MusicPlayerLeft from "@/components/music-player-left"
import MusicPlayerRight from "@/components/music-player-right"
import LoadingReveal from "@/components/loading-reveal";

export default function Home() {
  return (
    <>
      <LoadingReveal />
      <main className="w-screen h-screen flex flex-row bg-gradient-to-r from-red-900 to-black">
        <div className="flex-1 flex flex-col min-w-[350px] max-w-[480px] bg-red-900 bg-opacity-90 p-8">
          <MusicPlayerLeft />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <MusicPlayerRight />
        </div>
      </main>
    </>
  )
}
