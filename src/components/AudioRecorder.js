import React, { useState, useEffect, useRef } from 'react';

const AudioRecorder = () => {
  const [recordingStatus, setRecordingStatus] = useState(false);
  const recognitionRef = useRef(null);
  const ttsRef = useRef(window.speechSynthesis);
  let silenceTimer;

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.onresult = onSpeechResults;
      recognitionRef.current.start();
      console.log("Speech recognition started");
      setRecordingStatus(true);
    } else {
      console.error("Speech recognition not supported in this browser.");
    }

    return () => {
      console.log("Cleaning up");
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearTimeout(silenceTimer);
    };
  }, []);

  const onSpeechResults = (event) => {
    console.log("Speech results");
    clearTimeout(silenceTimer);

    silenceTimer = setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        console.log("Stopped speech recognition, about to start TTS");
        setRecordingStatus(false);
        startTextToSpeech();
      }
    }, 1500);
  };

  const startTextToSpeech = () => {
    console.log("Preparing to speak");
    const utterance = new SpeechSynthesisUtterance("Response from our backend");
    utterance.onend = () => {
      console.log("TTS finished, restarting speech recognition");
      handleTTSEnd();
    };
    ttsRef.current.speak(utterance);
    console.log("Speaking: Response from chat-bot");
  };

  const handleTTSEnd = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setRecordingStatus(true);
    }
  };

  return (
      <div>
        <h1>Speech Recognition Chat-Bot</h1>
        <p>{recordingStatus ? 'Recording...' : 'Not Recording'}</p>
      </div>
  );
};

export default AudioRecorder;
