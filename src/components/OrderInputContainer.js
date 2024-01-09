import React from 'react';
import OrderLog from './OrderLog';
import InputLog from './InputLog';
import '../styles/OrderInputContainer.css';

const OrderInputContainer = () => {
  return (
    <div className="order-input-container">
      <OrderLog />
      <InputLog />
    </div>
  );
};

export default OrderInputContainer;
