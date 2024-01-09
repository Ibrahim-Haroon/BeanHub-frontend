// CartItem.js
import React from 'react';
import '../styles/CartItem.css';

const CartItem = ({ className, itemName, quantity, price }) => {
  return (
    <div className={`cart-item ${className}`}>
      <div className="item-name">{itemName}</div>
      <div className="item-quantity">Quantity: {quantity}</div>
      <div className="item-price">Price: ${price}</div>
    </div>
  );
};

export default CartItem;
