import React from 'react';

const OrderTotal = ({ cartItems }) => {
    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            // Assuming item.item_name[2] is the price and item.item_name[1] is the quantity
            return total + (item.item_name[2] * item.item_name[1]);
        }, 0);
    };

    const total = calculateTotal(cartItems);

    return (
        <div className="order-total">
            <h3>Total: ${total.toFixed(2)}</h3> {/* toFixed(2) to format as a currency */}
        </div>
    );
};

export default OrderTotal;
