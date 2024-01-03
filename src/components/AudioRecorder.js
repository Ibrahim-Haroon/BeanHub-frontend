import React, { useState, useRef } from 'react';
import PlaybackCircle from "./PlaybackCircle";
import WaveformBars from "./WaveformBars";

const mimeType = "audio/webm";

const AudioRecorder = ({ onAudioRecorded }) => {
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [audioUrl, setAudioUrl] = useState("");
    const mediaRecorder = useRef(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const media = new MediaRecorder(mediaStream, { type: mimeType });
            mediaRecorder.current = media;
            setRecordingStatus("recording");
            mediaRecorder.current.start();

            let localAudioChunks = [];
            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    localAudioChunks.push(event.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(localAudioChunks, { type: mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                onAudioRecorded(audioUrl);
                setAudioChunks([]);
                mediaStream.getTracks().forEach(track => track.stop()); // Stop the media stream tracks
            };

            setAudioChunks(localAudioChunks);
        } catch (err) {
            console.error("Could not start recording:", err);
        }
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
    };


    return (
        <div>
            <WaveformBars recording={recordingStatus === "recording"}/>
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
