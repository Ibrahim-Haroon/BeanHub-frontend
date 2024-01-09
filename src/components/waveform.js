import React from 'react';
import '../styles/waveform.css';
import micIcon from '../images/microphone-icon.png';

function WaveformLoader() {
    return (
        <div className="loader">
            <img src={micIcon} alt="Microphone Icon" className="mic-icon" />
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
            <span className="stroke"></span>
        </div>
    );
}

export default WaveformLoader;