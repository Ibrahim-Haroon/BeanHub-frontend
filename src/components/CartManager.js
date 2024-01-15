import React, {useState} from 'react';
import parseOrder from '../utils/OrderParser';

const CartManager = () => {
    const [cartItems, setCartItems] = useState([]);

    const addItemToCart = (item) => {
        const parsedOrder = parseOrder(item);
        setCartItems(prevItems => [...prevItems, parsedOrder]);
    };

    const removeItemFromCart = (itemName) => {
        setCartItems(prevItems => prevItems.filter(item => item.item_name[0] !== itemName));
    };

    const updateItemQuantity = (itemName, newQuantity) => {
        setCartItems(prevItems => prevItems.map(item =>
            item.item_name[0] === itemName ? { ...item, item_name: [item.item_name[0], newQuantity, item.item_name[2]] } : item
        ));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Render logic and additional component functionality goes here

    return (
        <div>
            {/* Display cart items and total, add controls for modification */}
        </div>
    );
};

export default CartManager;