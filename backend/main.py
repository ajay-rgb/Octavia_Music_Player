from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uuid
import os
import time
import logging
import json
import subprocess
import shutil
from typing import Dict, Optional, List, Any
import yt_dlp
from ytmusicapi import YTMusic

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("octavia.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("octavia")

app = FastAPI(title="Octavia Music Player Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temp directory for downloads
TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

# Initialize YTMusic API
ytmusic = YTMusic()

# In-memory storage for download progress
download_progress: Dict[str, Dict[str, Any]] = {}

class SearchQuery(BaseModel):
    q: str

class DownloadRequest(BaseModel):
    videoId: str

class Track(BaseModel):
    id: str
    title: str
    artist: str
    thumbnail: str
    duration: str

def format_duration(duration_seconds: int) -> str:
    """Format duration in seconds to MM:SS format"""
    minutes = duration_seconds // 60
    seconds = duration_seconds % 60
    return f"{minutes}:{seconds:02d}"

def search_youtube_music(query: str) -> List[Track]:
    """Search YouTube Music for tracks"""
    try:
        search_results = ytmusic.search(query, filter="songs", limit=10)
        tracks = []
        
        for result in search_results:
            if result['resultType'] == 'song':
                # Extract the video ID from the videoId field
                video_id = result.get('videoId', '')
                
                # Get artist name
                artists = result.get('artists', [])
                artist_name = artists[0]['name'] if artists else "Unknown Artist"
                
                # Get thumbnail
                thumbnails = result.get('thumbnails', [])
                thumbnail_url = thumbnails[-1]['url'] if thumbnails else "/placeholder.svg?height=64&width=64"
                
                # Get duration
                duration_text = result.get('duration', '0:00')
                
                tracks.append(Track(
                    id=video_id,
                    title=result.get('title', 'Unknown Title'),
                    artist=artist_name,
                    thumbnail=thumbnail_url,
                    duration=duration_text
                ))
        
        return tracks
    except Exception as e:
        logger.error(f"Error searching YouTube Music: {str(e)}")
        raise e

def download_and_convert(video_id: str, request_id: str):
    """Background task to download and convert a YouTube video to MP3"""
    try:
        # Update progress to downloading
        download_progress[request_id] = {
            "phase": "downloading",
            "progress": 0,
            "videoId": video_id
        }
        
        output_path = os.path.join(TEMP_DIR, f"{video_id}_{request_id}.mp3")
        
        # Define download options
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(TEMP_DIR, f"{video_id}_{request_id}.%(ext)s"),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'progress_hooks': [lambda d: update_progress(d, request_id)],
            'quiet': True,
            'no_warnings': True,
        }
        
        # Download and convert using yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
        
        # Update progress to ready
        download_progress[request_id]["phase"] = "ready"
        download_progress[request_id]["progress"] = 100
        download_progress[request_id]["file_path"] = output_path
        logger.info(f"Download and conversion complete for {video_id}")
        
    except Exception as e:
        logger.error(f"Error processing {video_id}: {str(e)}")
        download_progress[request_id] = {
            "phase": "error",
            "progress": 0,
            "error": str(e),
            "videoId": video_id
        }

def update_progress(d, request_id):
    """Update progress based on yt-dlp progress hooks"""
    if d['status'] == 'downloading':
        try:
            # Extract download percentage
            downloaded_bytes = d.get('downloaded_bytes', 0)
            total_bytes = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
            
            if total_bytes > 0:
                percent = int((downloaded_bytes / total_bytes) * 100)
                download_progress[request_id]["progress"] = percent
                logger.debug(f"Download progress for {request_id}: {percent}%")
        except Exception as e:
            logger.error(f"Error updating download progress: {str(e)}")
    
    elif d['status'] == 'finished':
        # Update to converting phase
        download_progress[request_id]["phase"] = "converting"
        download_progress[request_id]["progress"] = 0
        logger.info(f"Download finished for {request_id}, starting conversion")

@app.get("/search")
async def search(q: str):
    """Search for tracks"""
    logger.info(f"Search query: {q}")
    try:
        results = search_youtube_music(q)
        return {"results": results}
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/download_and_stream")
async def start_download(request: DownloadRequest, background_tasks: BackgroundTasks):
    """Start downloading and converting a track"""
    video_id = request.videoId
    request_id = str(uuid.uuid4())
    
    logger.info(f"Download request for video {video_id}, request ID: {request_id}")
    
    # Start background task
    background_tasks.add_task(download_and_convert, video_id, request_id)
    
    # Initialize progress
    download_progress[request_id] = {
        "phase": "queued",
        "progress": 0,
        "videoId": video_id
    }
    
    return {"requestId": request_id}

@app.get("/progress")
async def get_progress(requestId: str):
    """Get the progress of a download/conversion"""
    if requestId not in download_progress:
        raise HTTPException(status_code=404, detail="Request ID not found")
    
    return download_progress[requestId]

@app.get("/stream")
async def stream(videoId: str, requestId: str):
    return await stream_audio(videoId, requestId)

@app.get("/stream_audio")
async def stream_audio(videoId: str, requestId: str):
    """Stream an audio file"""
    if requestId not in download_progress:
        raise HTTPException(status_code=404, detail="Request ID not found")
    
    progress = download_progress[requestId]
    
    if progress["phase"] != "ready" and progress["phase"] != "done":
        raise HTTPException(status_code=400, detail="Audio not ready for streaming")
    
    if "file_path" not in progress:
        raise HTTPException(status_code=500, detail="File path not found")
    
    file_path = progress["file_path"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # Mark as being streamed
    download_progress[requestId]["phase"] = "done"
    
    def iterfile():
        with open(file_path, "rb") as f:
            yield from f
    
    return StreamingResponse(
        iterfile(),
        media_type="audio/mpeg",
        headers={"Content-Disposition": f"attachment; filename={videoId}.mp3"}
    )

@app.on_event("startup")
async def startup_event():
    logger.info("Octavia backend starting up")
    # Clean temp directory on startup
    for file in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            logger.error(f"Error deleting {file_path}: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Octavia backend shutting down")
    # Clean temp directory on shutdown
    try:
        shutil.rmtree(TEMP_DIR)
        os.makedirs(TEMP_DIR, exist_ok=True)
    except Exception as e:
        logger.error(f"Error cleaning temp directory: {e}")

from fastapi import Request

@app.delete("/delete_audio")
async def delete_audio(request: Request):
    data = await request.json()
    request_id = data.get("requestId")
    if not request_id:
        raise HTTPException(status_code=400, detail="Missing requestId")

    progress = download_progress.get(request_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Request ID not found")

    file_path = progress.get("file_path")
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            logger.error(f"Error deleting file {file_path}: {e}")
            raise HTTPException(status_code=500, detail=f"Error deleting file: {e}")
    # Remove from progress dict
    download_progress.pop(request_id, None)
    return {"detail": "Audio file deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
