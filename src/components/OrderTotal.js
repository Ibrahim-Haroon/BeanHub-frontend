import React from 'react';

const OrderTotal = ({ cartItems }) => {
    const calculateTotal = (items) => {
        return items.reduce((total, item) => {
            let itemTotal = item.item_name[1] * item.item_name[2];

            // Calculate total for sub-items: add_ons, milk_type, sweeteners
            const calculateSubItemTotal = (subItems) => {
                return subItems.reduce((subTotal, subItem) => {
                    return subTotal + (subItem[1] * subItem[2]);
                }, 0);
            };

            if(item.add_ons) itemTotal += calculateSubItemTotal(item.add_ons);
            if(item.milk_type) itemTotal += calculateSubItemTotal(item.milk_type);
            if(item.sweeteners) itemTotal += calculateSubItemTotal(item.sweeteners);

            return total + itemTotal;
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
