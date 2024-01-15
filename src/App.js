import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import OrderScreen from "./components/OrderScreen";
import CartManager from "./components/CartManager";
import OrderTotal from "./components/OrderTotal";
import { parseOrder } from "./utils/OrderParser";
import './App.css';


function App() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const handleAudioRecorded = (audioUrl) => {
        setAudioUrl(audioUrl);
        setIsRecording(false);
    };

    const updateCart = (order) => {
        console.log("Going to update cart with order: ", order);
        const parsedOrder = parseOrder(order)
        console.log("Parsed order: ", parsedOrder);
        setCartItems(currentCartItems => [...currentCartItems, ...parsedOrder]);
    };

    return (
        <div className="App">
            <AudioRecorder onAudioRecorded={handleAudioRecorded} updateCart={updateCart} />
            <CartManager cartItems={cartItems} setCartItems={setCartItems} />
            <OrderScreen cartItems={cartItems} />
            <OrderTotal cartItems={cartItems} />
        </div>
    );
}

export default App;