// TotalBox.js
import React from 'react';
import './TotalBox.css';
import OrderTally from './OrderTally';

const TotalBox = ({ totalAmount }) => {
    return (
      <div className="total-box">
        <OrderTally totalAmount={totalAmount} />
      </div>
    );
  };

export default TotalBox;
