# Octavia Music Player



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




