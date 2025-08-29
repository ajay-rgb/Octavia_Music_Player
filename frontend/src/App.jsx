import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Tracks from './components/Tracks';
import Player from './components/Player'
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  async function fetchTracks(query = '') {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query 
        ? `https://octavia-02ed.onrender.com/api/search?q=${query}` 
        : `https://octavia-02ed.onrender.com/api/tracks`;
      
      const response = await axios.get(endpoint);
      setTracks(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load tracks. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
        setIsLoaded(true);
    }, 1500);
    fetchTracks();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchTracks(searchQuery);
  };
  
  return (
    <>
      {/* Conditionally render the main app content */}
      <div className="min-h-screen bg-violet-100 shadow-lg rounded-4xl text-black">
        <header className="py-2 px-4 border-black flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-2 sm:mb-0">Octavia</h1>
          <form onSubmit={handleSearch} className="w-full sm:w-auto flex py-4">
            <input
              type="search"
              placeholder='Search songs'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input border-violet-300 border-2 rounded-full px-4 py-2 text-black flex-1"
            />
            <button type="submit" className="ml-2 bg-violet-600 hover:bg-gray-800 text-white px-4 py-2 rounded-full">Search</button>
          </form>
        </header>
        <main className="flex flex-col md:flex-row">
          <div className='w-full md:w-1/2 p-4 overflow-y-scroll hide-scrollbar h-[calc(100vh-80px)]'>
            {loading ? (
              <div className="loading text-center">Loading tracks...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : tracks.length > 0 ? (
              <Tracks tracks={tracks} onTrackSelect={setSelectedTrack} />
            ) : (
              <p className='text-center'>No tracks found. Please try a different search query.</p>
            )}
          </div>
          <div className="w-full md:w-1/2 p-4 h-[calc(100vh-80px)]">
            {selectedTrack ? <Player track={selectedTrack}/> : <p className="mt-8 text-center">Select a song to play.</p>}
          </div>
        </main>
      </div>

      {/* Conditionally render the loading screen on top */}
      {!isLoaded && <LoadingScreen />}
    </>
);
}

export default App;