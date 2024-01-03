import './_AudioRecorder.css';
import React, { useEffect, useState } from 'react';
import { uploadToS3 } from '../utils/aws-s3';

const _AudioRecorder = ({ onRecordingComplete }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioData, setAudioData] = useState([]);

    useEffect(() => {
        // Request permission and get user media
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.ondataavailable = (event) => {
                    setAudioData(currentData => [...currentData, event.data]);
                };

                recorder.onstop = async () => {
                    const audioBlob = new Blob(audioData, { type: 'audio/wav' });
                    await uploadToS3(audioBlob);
                };
            })
            .catch(console.error);
    }, []);

    const startRecording = () => {
        setAudioData([]);
        mediaRecorder.start();
    };

    const stopRecording = () => {
        mediaRecorder.stop();
    };

    return (
        <div className="audio-recorder-container">
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
        </div>
    );
};

export default _AudioRecorder;


