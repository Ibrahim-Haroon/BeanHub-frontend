import React from 'react';
import styles from '../styles/WaveformBars.module.css';

const WaveformBars = ({ recording }) => {
    return (
        <div className="waveform-container">
            <div className="microphone-icon"></div>
            <div className="waveform-bars">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className={`bar ${recording ? 'active' : ''}`}></div>
                ))}
            </div>
        </div>
    );
};

export default WaveformBars;

