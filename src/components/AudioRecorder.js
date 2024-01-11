import React, { useState, useEffect, useRef } from 'react';
import OscillatingCircle from "./oscillatingCircle";
import WaveformLoader from "./waveform";
import toWav from 'audiobuffer-to-wav';
import { uploadToS3, deleteFromS3, saveFromS3, deleteTempFile } from '../utils/aws-s3';
import { fetchProcessedAudio, initialFetchProcessedAudio } from '../utils/endpoint_api';
import OrderTally from './OrderTally';
import '../styles/AudioRecorder.css';

const mimeType = "audio/webm";

const AudioRecorder = () => {
  const [recordingStatus, setRecordingStatus] = useState(false);
  const mediaRecorder = useRef(null);
  const localAudioChunks = useRef([]);
  const mediaStream = useRef(null);
  const audioContext = useRef(new AudioContext());
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [uniqueId, setUniqueId] = useState(null);
  let silenceTimer;

  useEffect(() => {
    async function initMediaStream() {
      try {
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(mediaStream.current, { type: mimeType });
        startRecording(); // Start recording automatically
      } catch (err) {
        console.error("Error accessing the microphone", err);
      }
    }

    initMediaStream();

    return () => {
      mediaStream.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const onSpeechResults = () => {
    console.log("Speech detected");
    clearTimeout(silenceTimer);

    silenceTimer = setTimeout(() => {
      if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
        mediaRecorder.current.stop();
        console.log("Stopped recording");
        setRecordingStatus(false);
      }
    }, 1500);
  };

  const startRecording = () => {
    setRecordingStatus(true);
    localAudioChunks.current = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        localAudioChunks.current.push(event.data);
      }
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(localAudioChunks.current, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);
      await convertToWav(audioUrl);
      localAudioChunks.current = [];
    };

    mediaRecorder.current.start();
    onSpeechResults();
  };

  const convertToWav = async (audioUrl) => {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const decodedAudio = await audioContext.current.decodeAudioData(audioBuffer);

      const wavData = toWav(decodedAudio);
      const wavBlob = new Blob([wavData], { type: 'audio/wav' });

      const uploadFileName = await uploadToS3(wavBlob);
      await handleProcessedAudio(uploadFileName);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleProcessedAudio = async (uploadFileName) => {
    try {
      let response = null;
      if (!uniqueId) {
        response = await initialFetchProcessedAudio(uploadFileName);
        setUniqueId(response.unique_id);
      } else {
        response = await fetchProcessedAudio(uploadFileName, uniqueId);
      }

      if (response && response.file_name && response.json_order) {
        setTotalAmount(prevTotalAmount => prevTotalAmount + response.json_order['MenuItem']['price']);
        const tempFilePath = await saveFromS3(response.file_name);
        await fetchAndPlayAudio(tempFilePath);
        await deleteTempFile(tempFilePath);
        await deleteFromS3(response.file_name);
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const fetchAndPlayAudio = (filePath) => {
    fetch(filePath)
        .then(data => data.arrayBuffer())
        .then(arrayBuffer => {
          try {
            return audioContext.current.decodeAudioData(arrayBuffer);
          } catch (error) {
            console.error('Error decoding audio data:', error);
            throw error;
          }
        })
        .then(decodedAudio => {
          setAudioBuffer(decodedAudio);
          const event = new Event('playbackEvent');
          window.dispatchEvent(event);
        });
  };

  useEffect(() => {
    const playback = () => {
      if (audioBuffer && !hasPlayedAudio) {
        const playSound = audioContext.current.createBufferSource();
        playSound.buffer = audioBuffer;
        playSound.connect(audioContext.current.destination);
        playSound.start(audioContext.current.currentTime);
        playSound.onended = () => {
          setHasPlayedAudio(true);
          startRecording(); // Restart recording after playback
        };
      }
    };

    playback();

    return () => {
      window.removeEventListener("playbackEvent", playback);
    };
  }, [audioBuffer, hasPlayedAudio]);

  return (
      <div className="audio-recorder-container">
        <OscillatingCircle />
        <div className="waveform-loader-container">
          <WaveformLoader recording={recordingStatus} />
        </div>
        <div className="status-indicator">
          <p>{recordingStatus ? 'Recording...' : 'Not Recording'}</p>
        </div>
        <OrderTally totalAmount={totalAmount} />
      </div>
  );
};

export default AudioRecorder;
