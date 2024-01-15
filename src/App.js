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
        const parsedOrder = parseOrder(order);
        console.log("Parsed order: ", parsedOrder);
        for (const order of parsedOrder) {
            console.log(order['cart_action']);
            if (order['cart_action'] === 'modification') {
                updateItemQuantity(order['item_name'][0], order['item_name'][1])
            }
            else setCartItems(currentCartItems => [...currentCartItems, order]);
        }
    };

    const updateItemQuantity = (itemName, quantityChange) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.item_name[0] === itemName) {
                const updatedQuantity = item.item_name[1] + quantityChange;
                return updatedQuantity > 0
                    ? { ...item, item_name: [item.item_name[0], updatedQuantity, item.item_name[2]] }
                    : null;
            }
            return item;
        }).filter(item => item != null));
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