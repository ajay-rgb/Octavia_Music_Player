// src/components/Tracks.jsx
import React from 'react';
import TrackCard from './TrackCard';

const Tracks = ({ tracks, onTrackSelect }) => {
    if (!tracks || tracks.length === 0) {
        return <p>No tracks found</p>;
    }

    return (
        <div className="tracks-list">
            {
                tracks.map((track) => (
                    // Pass the onTrackSelect prop down to the TrackCard
                    <TrackCard 
                        key={track.videoId} 
                        data={track} 
                        onTrackSelect={onTrackSelect}
                    />
                ))
            }
        </div>
    );
};

export default Tracks;