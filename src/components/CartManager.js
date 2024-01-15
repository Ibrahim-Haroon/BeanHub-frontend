import React from 'react';
import {parseOrder} from "../utils/OrderParser";

const CartManager = ({ cartItems, setCartItems }) => {

    const addItemToCart = (order) => {
        const parsedOrder = parseOrder(order);
        setCartItems(prevItems => [...prevItems, ...parsedOrder]); // Assuming parseOrder returns an array of items
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
        // Assuming item.item_name[2] is the price and item.item_name[1] is the quantity
        return cartItems.reduce((total, item) => total + (item.item_name[2] * item.item_name[1]), 0);
    };

    // CartManager does not render anything itself
    return null;
};

export default CartManager;
