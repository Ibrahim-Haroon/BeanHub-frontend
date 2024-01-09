import React from 'react';
import AudioRecorder from './AudioRecorder';
import './InputLog.css';

const InputLog = () => {
  return (
    <div className="input-log">
      <strong>Please Speak to Place Your Order</strong>
      <AudioRecorder />
    </div>
  );
};

export default InputLog;
