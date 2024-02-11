import React, { useEffect, useRef } from 'react';

const AudioStreamer = ({ uniqueId, trigger }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            const noCacheParam = `cache_bust=${new Date().getTime()}`;
            const streamUrl =  process.env.REACT_APP_BACKEND_ENDPOINT + `/audio_stream?unique_id=${uniqueId}&${noCacheParam}`;

            if (!audioElement.paused) {
                audioElement.pause();
                audioElement.currentTime = 0; // Reset playback position
            }

            audioElement.src = ''; // Reset src to ensure reload
            audioElement.src = streamUrl;
            audioElement.load(); // Force loading the new source
            audioElement.play().catch(err => console.error("Error playing streamed audio:", err));
        }

        // Cleanup function to pause and reset the audio element when the component unmounts or trigger changes
        return () => {
            if (audioElement) {
                audioElement.pause();
                audioElement.src = '';
            }
        };
    }, [uniqueId, trigger]); // React to changes in either uniqueId or trigger

    return <audio ref={audioRef} controls style={{ display: 'none' }} />;
};

export default AudioStreamer;
