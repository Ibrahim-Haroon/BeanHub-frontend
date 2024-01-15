import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import OrderScreen from "./components/OrderScreen";
import CartManager from "./components/CartManager";
import './App.css';


function App() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const handleAudioRecorded = (audioUrl) => {
        setAudioUrl(audioUrl);
        setIsRecording(false);
    };

    const handleAddItem = (item) => {
        // Logic to add item to cart
    };

    return (
        <div className="App">
            <CartManager setCartItems={setCartItems} addItemToCart={handleAddItem} />
            <OrderScreen cartItems={cartItems} />
            <AudioRecorder onAudioRecorded={handleAudioRecorded}/>
        </div>
    );
}

export default App;