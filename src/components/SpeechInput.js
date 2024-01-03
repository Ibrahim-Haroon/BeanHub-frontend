// SpeechInput.js
import React from 'react';
import './SpeechInput.css';

const SpeechInput = () => {
  return (
    <div className="speech-input-card">
      <div className="speech-input-container">
        <button className="speech-button">Start Listening</button>
        <button className="speech-button">Stop Listening</button>
      </div>
    </div>
  );
};

export default SpeechInput;
