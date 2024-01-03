import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import PlaybackCircle from './components/PlaybackCircle';
import WaveformBars from './components/WaveformBars';
import './App.css';

function App() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleAudioRecorded = (audioUrl) => {
        setAudioUrl(audioUrl);
        setIsRecording(false);
        // Play the audio
        setIsPlaying(true);
        let audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => setIsPlaying(false);
    };

    return (
        <div className="App">
            <PlaybackCircle playing={isPlaying} />
            <WaveformBars recording={isRecording} />
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
        </div>
    );
}

export default App;
