import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import MicIcon from './components/MicIcon';
import './App.css';


function App() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleAudioRecorded = (audioUrl) => {
        setAudioUrl(audioUrl);
        setIsRecording(false);
    };

    return (
        <div className="App">
            <MicIcon recording={isRecording} />
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
        </div>
    );
}

export default App;