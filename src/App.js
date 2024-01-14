// import React, { useState } from 'react';
// import AudioRecorder from './components/AudioRecorder';
// import OrderLog from './components/OrderLog';
// import OrderInputContainer from './components/OrderInputContainer';
//
// function App() {
//     const [totalAmount, setTotalAmount] = useState(100);
//     return (
//     <div className="App">
//         <OrderInputContainer />
//     </div>
//     );
// }
//
// export default App;
//


import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import MicIcon from './components/MicIcon';
import './App.css';


function App() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleAudioRecorded = (audioUrl) => {
        setAudioUrl(audioUrl);
        setIsRecording(false);
    };

    return (
        <div className="App">
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
        </div>
    );
}

export default App;