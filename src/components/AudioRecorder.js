import React, { useState, useEffect, useRef } from 'react';
import toWav from 'audiobuffer-to-wav';

const mimeType = "audio/webm";


const AudioRecorder = ({ onAudioRecorded }) => {
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioUrl, setAudioUrl] = useState("");
    const mediaRecorder = useRef(null);
    const localAudioChunks = useRef([]);
    const mediaStream = useRef(null); // Ensure this is declared as useRef

    useEffect(() => {
        // Pre-initialize the media stream
        async function initMediaStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStream.current = stream; // Assign stream to mediaStream.current
                mediaRecorder.current = new MediaRecorder(stream, { type: mimeType });
            } catch (err) {
                console.error("Error accessing the microphone", err);
            }
        }

        initMediaStream();

        // Cleanup function to stop the media stream when the component is unmounted
        return () => {
            if (mediaStream.current) {
                mediaStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

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
        const audioCtx = new AudioContext();
        await audioCtx.decodeAudioData(audioBuffer, (buffer) => {
            const wav = toWav(buffer);
            const blob = new Blob([new DataView(wav)], {type: 'audio/wav'});
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            // Notify parent with WAV URL if necessary
            // onAudioRecorded(url);
        }, (e) => {
            console.log('Audio decoding failed', e);
        });
    };

    return (
        <div>
            <button onClick={startRecording} disabled={recordingStatus === "recording"}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={recordingStatus !== "recording"}>
                Stop Recording
            </button>
            {audioUrl && (
                <audio src={audioUrl} controls="controls" />
            )}
        </div>
    );
};

export default AudioRecorder;
