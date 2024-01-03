// Order.js
import React from 'react';
import './Order.css';

const Order = () => {
  return (
    <div className="order-container" data-testid="order">
      <div className="order-card">
        <div className="order-header">
          <h2>Your Order</h2>
        </div>
        <div className="order-items">
          {/* Display ordered items here */}
          <p>No items in your order</p>
        </div>
        <div className="order-total">
          {/* Display total amount here */}
          <p>Total: $0.00</p>
        </div>
      </div>
    </div>
  );
};

export default Order;
