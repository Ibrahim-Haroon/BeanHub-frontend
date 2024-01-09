import React, { useState, useEffect, useRef } from 'react';
import OscillatingCircle from "./oscillatingCircle";
import WaveformLoader from "./waveform";
import toWav from 'audiobuffer-to-wav';
import { uploadToS3, deleteFromS3, saveFromS3, deleteTempFile } from '../utils/aws-s3';
import { fetchProcessedAudio } from '../utils/endpoint_api';
import OrderTally from './OrderTally';
import '../styles/AudioRecorder.css'; // Add this line if you create a CSS file for AudioRecorder

const mimeType = "audio/webm";

const AudioRecorder = ({ onAudioRecorded }) => {
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const mediaRecorder = useRef(null);
    const localAudioChunks = useRef([]);
    const mediaStream = useRef(null);
    const audioContext = useRef(new AudioContext());
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
    const [totalAmount, setTotalAmount] = useState(1000);

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
            if (audioBuffer && !hasPlayedAudio) {
                const playSound = audioContext.current.createBufferSource();
                playSound.buffer = audioBuffer;
                playSound.connect(audioContext.current.destination);
                playSound.start(audioContext.current.currentTime);
                setHasPlayedAudio(true);
            }
        };

        playback();

        return () => {
            window.removeEventListener("playbackEvent", playback);
        };
    }, [audioBuffer, hasPlayedAudio]);

    const startRecording = () => {
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
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
    };

    const convertToWav = async (audioUrl) => {
        try {
            const response = await fetch(audioUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const audioBuffer = await response.arrayBuffer();
            const audioContext = new AudioContext();
            const decodedAudio = await audioContext.decodeAudioData(audioBuffer);

            const wavData = toWav(decodedAudio);
            const wavBlob = new Blob([wavData], { type: 'audio/wav' });

            await uploadToS3(wavBlob);
            await handleProcessedAudio();
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    const handleProcessedAudio = async () => {
        const response = await fetchProcessedAudio();

        if (response && response.file && response.floating_point_number) {
            setTotalAmount(prevTotalAmount => prevTotalAmount + response.floating_point_number);
            const tempFilePath = await saveFromS3(response.file);
            await fetchAndPlayAudio(tempFilePath);
            await deleteTempFile(tempFilePath);
            await deleteFromS3(response.file);
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

    return (
        <div className="audio-recorder-container">
            {/* Other components */}
            <OscillatingCircle />
            <div className="waveform-loader-container">
                <WaveformLoader recording={recordingStatus === "recording"} />
            </div>
            <div className="button-container">
                <button onClick={startRecording} disabled={recordingStatus === "recording"}>
                    Start Recording
                </button>
                <button onClick={stopRecording} disabled={recordingStatus !== "recording"}>
                    Stop Recording
                </button>
            </div>
        </div>
    );
};

export default AudioRecorder;
