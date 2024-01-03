import React, { useState, useEffect, useRef } from 'react';
import MicIcon from "./MicIcon";
import toWav from 'audiobuffer-to-wav';
import { uploadToS3, deleteFromS3, saveFromS3, deleteTempFile } from '../utils/aws-s3';
import { fetchProcessedAudio } from '../utils/endpoint_api';

const mimeType = "audio/webm";

const AudioRecorder = ({ onAudioRecorded }) => {
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const mediaRecorder = useRef(null);
    const localAudioChunks = useRef([]);
    const mediaStream = useRef(null);
    const audioContext = useRef(new AudioContext());
    const [audioBuffer, setAudioBuffer] = useState(null);

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
            if (audioBuffer) {
                const playSound = audioContext.current.createBufferSource();
                playSound.buffer = audioBuffer;
                playSound.connect(audioContext.current.destination);
                playSound.start(audioContext.current.currentTime);
            }
        };

        window.addEventListener("mousemove", playback);

        return () => {
            window.removeEventListener("playbackEvent", playback);
        };
    }, [audioBuffer]);

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
        const response = await fetch(audioUrl);
        const audioBuffer = await response.arrayBuffer();
        const wavBlob = new Blob([new DataView(audioBuffer)], { type: 'audio/wav' });
        await uploadToS3(wavBlob);
        await handleProcessedAudio();
    };

    const handleProcessedAudio = async () => {
        const response = await fetchProcessedAudio();
        if (response && response.file) {
            const tempFilePath = await saveFromS3(response.file);
            fetchAndPlayAudio(tempFilePath);
            await deleteTempFile(tempFilePath);
            await deleteFromS3(response.file);
        }
    };

    const fetchAndPlayAudio = (filePath) => {
        fetch(filePath)
            .then(data => data.arrayBuffer())
            .then(arrayBuffer => audioContext.current.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
                setAudioBuffer(decodedAudio);
                const event = new Event('playbackEvent');
                window.dispatchEvent(event);
            });
    };

    return (
        <div>
            <MicIcon recording={recordingStatus === "recording"}/>
            <button onClick={startRecording} disabled={recordingStatus === "recording"}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={recordingStatus !== "recording"}>
                Stop Recording
            </button>
        </div>
    );
};

export default AudioRecorder;
