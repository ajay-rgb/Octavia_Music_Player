# Octavia Music Player

A modern, full-stack music player app that allows users to search for tracks from YouTube Music, download audio, and stream/playback songs seamlessly in the browser.

## Features

- Search for tracks from YouTube Music using ytmusicapi
- Download and convert audio to MP3 using yt-dlp
- Real-time progress tracking for downloads and conversions
- Streaming playback in the browser
- Debug mode for troubleshooting

## Project Structure

\`\`\`
octavia-music-player/
├── app/                    # Next.js frontend
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React components
├── lib/                    # Utilities and state management
├── backend/                # FastAPI backend
│   ├── main.py             # Main backend code
│   └── requirements.txt    # Python dependencies
└── README.md               # This file
\`\`\`

## Setup Instructions

### Frontend (Next.js)

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Backend (FastAPI)

1. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`

3. Install ffmpeg:
   - **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
   - **macOS**: `brew install ffmpeg`
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH

4. Start the backend server:
   \`\`\`bash
   python main.py
   \`\`\`

## Debugging

### Debug Mode

The app includes a built-in debug mode that can be toggled by:
- Clicking the bug icon in the bottom right corner
- Using the keyboard shortcut `Ctrl+Shift+D`

Debug mode shows:
- API requests and responses
- Download and conversion progress
- Playback events
- Errors and warnings

### Common Issues and Solutions

1. **Audio not playing**
   - Check if the download/conversion is complete
   - Verify the audio file exists on the backend
   - Check browser console for errors

2. **Download/conversion stuck**
   - Check backend logs for errors
   - Verify yt-dlp and ffmpeg are installed correctly
   - Restart the backend server

3. **CORS errors**
   - Ensure the frontend and backend are running on the expected ports
   - Default ports: Frontend (3000), Backend (8000)

4. **File not found errors**
   - Verify the temp directory exists and is writable
   - Check if the requestId is being passed correctly

5. **YouTube Music API issues**
   - Check if ytmusicapi is installed correctly
   - Verify internet connection
   - YouTube might be rate-limiting requests

## Implementation Notes

- The frontend uses Zustand for state management with devtools for debugging
- The backend uses ytmusicapi for searching YouTube Music
- yt-dlp is used for downloading and converting audio
- Progress tracking is implemented via polling
- Audio streaming uses proper content types and headers
- Error handling is implemented at multiple levels

## License

MIT
