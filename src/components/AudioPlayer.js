import './AudioPlayer.css';
import React, { useState, useEffect } from 'react';
import { fetchProcessedAudio } from '../utils/endpoint_api';

const AudioPlayer = () => {
    const [audioBuffer, setAudioBuffer] = useState(null);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    useEffect(() => {
        fetchProcessedAudio()
            .then(data => {
                fetch(data.file)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                    .then(decodedAudio => {
                        setAudioBuffer(decodedAudio);
                    });
            });
    }, []);

    const playAudio = () => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(audioContext.currentTime);
    };

    return (
        <div>
            <button onClick={playAudio}>Play Audio</button>
        </div>
    );
};

export default AudioPlayer;