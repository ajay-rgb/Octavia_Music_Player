import MusicPlayer from "@/components/music-player"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-center">OCTAVIA</h1>
      <MusicPlayer />
    </main>
  )
}
