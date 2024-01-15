// OrderTotal.js
import React from 'react';

const OrderTotal = ({ totalAmount }) => {
    return (
      <div className="order-tally">
        <h2>Total: {totalAmount}</h2>
      </div>
    );
  };

export default OrderTotal;
