import React, { useState, useRef, useEffect } from 'react';

const Player = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (track && audioRef.current) {
      const audioUrl = `https://octavia-02ed.onrender.com/stream?id=${track.videoId}`;
      audioRef.current.src = audioUrl;
      
      const handleCanPlay = () => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      };
      
      if (audioRef.current) {
        audioRef.current.addEventListener('canplay', handleCanPlay);
      }
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, [track]); 

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  if (!track) {
    return null;
  }
  
   const thumbnail = track.thumbnails && track.thumbnails.length > 0 
    ? track.thumbnails[track.thumbnails.length - 1].url 
    : '';
  const proxyThumbnailUrl = thumbnail ? `https://octavia-02ed.onrender.com/api/thumbnail-proxy?url=${encodeURIComponent(thumbnail)}` : '';

  return (
    <div className="player-container items-center justify-between flex  py-4 h-full flex-col">

        <div className='flex flex-col justify-center items-center'>

            <div className='w-50 border-1 border-black rounded-md overflow-clip'>
                <img
            src={proxyThumbnailUrl}
            alt={`Album art for ${track.title}`}
            className="player-thumbnail w-full"
            />
          </div>
            
        <h3 className='text-2xl font-bold'>{track.title}</h3>
        <p className='text-3xl font-bold'>{track.artist}</p>
        </div>
      

      <button 
      className='bg-violet-600  text-white font-semibold border-2 px-4  p-2 rounded-full my-2 '
      onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <audio 
        className='w-full my-2  bottom-0'
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls
      />
    </div>
  );
};

export default Player;