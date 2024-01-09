// OrderLog.js
import React from 'react';
import CartItem from './CartItem';
import TotalBox from './TotalBox';
import './OrderLog.css';

const OrderLog = ({ totalAmount }) => {
  console.log('Total Amount in OrderLog:', totalAmount);

  return (
    <div className="order-log">
      <strong>Your Order</strong>
      <div className="cart-items-list">
        {/* Placeholder CartItem components for demonstration */}
        <CartItem className="first-item" itemName="Item 1" quantity={2} price={10} />
        <CartItem className="second-item" itemName="Item 2" quantity={1} price={15} />
        <CartItem className="third-item" itemName="Item 3" quantity={1} price={15} />
        <CartItem className="third-item" itemName="Item 3" quantity={1} price={15} />
      </div>
      {/* Render the TotalBox component with totalAmount */}
      <TotalBox totalAmount={totalAmount} />
    </div>
  );
};

export default OrderLog;
