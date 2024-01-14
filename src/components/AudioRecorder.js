import React, { useState, useEffect, useRef } from 'react';
import OscillatingCircle from "./oscillatingCircle";
import WaveformLoader from "./waveform";
import toWav from 'audiobuffer-to-wav';
import { uploadToS3, deleteFromS3, saveFromS3, deleteTempFile } from '../utils/aws-s3';
import { fetchProcessedAudio, initialFetchProcessedAudio } from '../utils/endpoint_api';
import OrderTally from './OrderTally';
import '../styles/AudioRecorder.css';

const mimeType = "audio/webm";

const AudioRecorder = ({onAudioRecorded}) => {
  const [recordingStatus, setRecordingStatus] = useState(false);
  const mediaStream = useRef(null);
  const localAudioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(new AudioContext());
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [uniqueId, setUniqueId] = useState(null);

  useEffect(() => {
    async function initMediaStream() {
      try {
        mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(mediaStream.current, { type: mimeType });
      } catch (err) {
        console.error("Error accessing the microphone", err);
      }
    }

    initMediaStream();

    return () => {
      mediaStream.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    const playback = () => {
      if (audioBuffer && !hasPlayedAudio) { // Check if audio has not been played yet
        const playSound = audioContext.current.createBufferSource();
        playSound.buffer = audioBuffer;
        playSound.connect(audioContext.current.destination);
        playSound.start(audioContext.current.currentTime);
        setHasPlayedAudio(true); // Set the flag to prevent further playback
      }
    };

    playback()

    return () => {
      window.removeEventListener("playbackEvent", playback);
    };
  }, [audioBuffer, hasPlayedAudio]);

  const toggleRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      stopRecording();
    } else {
      setHasPlayedAudio(false); // Reset the flag to allow playback
      startRecording();
    }
  };

  const startRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      // Exit if the recorder is already recording or paused
      return;
    }

    setRecordingStatus("recording");
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
      onAudioRecorded(audioUrl);
      localAudioChunks.current = [];
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    setRecordingStatus(false);
    mediaRecorder.current.stop();
  };


  // Convert audio to .wav format
  const convertToWav = async (audioUrl) => {
    try {
      console.log("Converting to wav")
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const decodedAudio = await audioContext.current.decodeAudioData(audioBuffer);

      const wavData = toWav(decodedAudio);
      const wavBlob = new Blob([wavData], { type: 'audio/wav' });
      console.log("Successfully converted to wav and uploaded to S3");
      const uploadFileName = await uploadToS3(wavBlob);
      console.log("Successfully uploaded to S3 and about to process backend response audio");
      await handleProcessedAudio(uploadFileName);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  /*
   Call backend endpoint to process audio by:
    1. download res_{unique_id} from s3
    2. play res_{unique_id} with fetchAndPlayAudio
    3. delete local copy,
    4. delete original version on S3

  */
  const handleProcessedAudio = async (uploadFileName) => {
    try {
      let response = null;
      if (!uniqueId) {
        console.log("Fetching initial processed audio with POST request");
        response = await initialFetchProcessedAudio(uploadFileName);
        setUniqueId(response.unique_id);
      } else {
        console.log("Fetching processed audio with PATCH request");
        response = await fetchProcessedAudio(uploadFileName, uniqueId);
      }

      console.log("Response from backend: ", response);

      if (response && response.file_path && response.json_order) {
        console.log("Got valid response from backend");
        const prices: number[] = response.json_order[0].MenuItem.price;
        let sum = prices.reduce(function (acc, currentValue) {
          return acc + currentValue;
        }, 0);
        setTotalAmount(prevTotalAmount => prevTotalAmount + sum);
        console.log("Saving res file from S3");
        const tempFilePath = await saveFromS3(response.file_path);
        console.log("Successfully saved res file from S3 and about to decode audio");
        await fetchAndPlayAudio(tempFilePath);
        await deleteTempFile(tempFilePath);
        await deleteFromS3(response.file_path);
      } else {
        console.log("Got invalid response from backend");
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  // Fetch local copy of audio file decoded into .wav
  const fetchAndPlayAudio = (filePath) => {
    fetch(filePath)
        .then(data => data.arrayBuffer())
        .then(arrayBuffer => {
          try {
            console.log("Successfully decoded audio");
            return audioContext.current.decodeAudioData(arrayBuffer);
          } catch (error) {
            console.error('Error decoding audio data:', error);
            throw error;
          }
        })
        .then(decodedAudio => {
          console.log("Successfully decoded audio and about to play")
          setAudioBuffer(decodedAudio);
          const event = new Event('playbackEvent');
          window.dispatchEvent(event);
          setAudioBuffer(null); // Clear the audio buffer
        });
  };


  return (
      <div className="audio-recorder" onClick={toggleRecording} style={{height: '100vh', width: '100vw'}}>
        <OscillatingCircle/>
        <div className="status-indicator">
          <p>{recordingStatus ? 'Recording...' : 'Not Recording'}</p>
        </div>
        <div className="waveform-loader-container">
          <WaveformLoader recording={recordingStatus}/>
        </div>
        <OrderTally totalAmount={totalAmount}/>
      </div>
  );
};

export default AudioRecorder;
