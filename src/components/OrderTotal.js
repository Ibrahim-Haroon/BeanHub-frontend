// OrderTally.js
import React from 'react';

const OrderTally = ({ totalAmount }) => {
    return (
      <div className="order-tally">
        <h2>Total: {totalAmount}</h2>
      </div>
    );
  };

export default OrderTally;
