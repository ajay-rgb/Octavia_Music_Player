![OCtavia](https://github.com/user-attachments/assets/a5047dd1-8c53-4859-bd28-7c0cf7b0395b)## Octavia

A full-stack music streaming application that allows users to search for songs and stream them directly from YouTube Music. The application is built with a modern and efficient tech stack to provide a smooth user experience.


![OCtavia](https://github.com/user-attachments/assets/dc21ea7c-d71c-43c4-9811-3cd0b7a03825)

-----

### Key Features

  * **Music Search**: Search for songs using the YouTube Music API.
  * **Audio Streaming**: Stream audio directly from YouTube Music videos.
  * **Audio Player**: A custom audio player with play/pause functionality.
  * **Responsive UI**: A user interface that adapts to different screen sizes.

-----

### Tech Stack

This project is built as a full-stack application with separate frontend and backend components.

#### Frontend

  * **React**: A JavaScript library for building user interfaces.
  * **Vite**: A modern build tool for a fast development experience.
  * **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
  * **Axios**: A promise-based HTTP client for making API requests.

#### Backend

  * **Flask**: A lightweight Python web framework for building the API.
  * **Python**: The core programming language for the backend.
  * **yt-dlp**: A command-line program to download videos from YouTube.
  * **FFmpeg**: A command-line tool for audio and video conversion.
  * **ytmusicapi**: A Python library to interact with the YouTube Music API.

-----

### Local Development Setup

To run this project on your local machine, follow these steps.

#### 1\. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

#### 2\. Backend Setup

The backend is in the `/server` directory.

```bash
cd server

# Create and activate a Python virtual environment
python -m venv venv
# On macOS/Linux
source venv/bin/activate
# On Windows
.\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 3\. Frontend Setup

The frontend is in the `/client` directory.

```bash
cd ../client

# Install npm dependencies
npm install
```

#### 4\. Environment Variables

Create a `.env` file in the `/client` directory for the frontend and in the `/server` directory for the backend.

**`/client/.env`**:

```
VITE_API_BASE_URL=http://localhost:5000
```

**`/server/.env`**:

```
YTDLP_COOKIES=<Your YouTube cookies string here>
```

#### 5\. Run the Application

In a separate terminal for each part of the project:

```bash
# Run the backend
cd server
.\venv\Scripts\activate
python app.py

# Run the frontend
cd ../client
npm run dev
```

-----

### Deployment

This project is designed for separate deployment of the frontend and backend.

#### Frontend Deployment

The frontend can be deployed to a static hosting service like **Vercel** or **Netlify**.

1.  Push your frontend code to a GitHub repository.
2.  Connect the repository to Vercel or Netlify.
3.  Set the **`VITE_API_BASE_URL`** environment variable to the live URL of your backend service.

#### Backend Deployment

The backend can be deployed to a platform like **Render** or **Heroku** that supports a full Python environment.

1.  Push your backend code to a GitHub repository.
2.  Connect the repository to Render.
3.  Configure the build process to install system dependencies like **FFmpeg**.
4.  Set the **`YTDLP_COOKIES`** environment variable in your Render dashboard.

-----

### Future Enhancements

  * **User Accounts**: Implement user authentication and profiles.
  * **Playlists**: Allow users to create and manage playlists.
  * **Real-time Progress Bar**: Add a progress bar to the player for seeking and tracking.
  * **Mobile Optimizations**: Further optimize the UI and performance for a better mobile experience.
