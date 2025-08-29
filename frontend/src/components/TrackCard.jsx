import React from 'react';

const TrackCard = ({ data, onTrackSelect }) => {
    // Access the first thumbnail's URL from the thumbnails array
    const thumbnail = data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[0].url : '';
    // Use the duration string provided by the API
    const duration = data.duration || '';

    const handleCardClick = () => {
        // Call the onTrackSelect function from the parent, passing the full song data
        if (onTrackSelect) {
            onTrackSelect(data);
        }
    };
    
    return (
        <div 
            className="track-card flex my-4 w-11/12 mx-auto p-2   shadow-sm bg-violet-50 py-3 px-4 rounded-sm cursor-pointer md:flex-grow md:flex-shrink "
            onClick={handleCardClick}
        >
            {thumbnail && (
                <img 
                    src={thumbnail} 
                    alt={`Thumbnail for ${data.title}`} 
                    className=" object-cover mr-6 rounded" 
                />
            )}
            <div className="flex-1 flex items-center justify-start">
                <h1 className="text-lg font-bold">{data.title}</h1>
                <h3 className="text-sm font-light">{data.artist}</h3>
            </div>
            {duration && (
                <div className="flex-none self-center text-sm font-medium">
                    {duration}
                </div>
            )}
        </div>
    );
};

export default TrackCard;