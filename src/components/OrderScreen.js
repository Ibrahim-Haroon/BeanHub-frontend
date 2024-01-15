import React from 'react';

const OrderScreen = ({ cartItems }) => {
    const renderSubItems = (subItems) => {
        return subItems.map((subItem, index) => (
            <div key={index} className="sub-item">
                <span>{subItem[0]} (Qty: {subItem[1]}, Price: ${subItem[2]})</span>
            </div>
        ));
    };

    const renderItemDetails = (item) => {
        // Destructure item properties
        const { item_name, size, temp, add_ons, milk_type, sweeteners } = item;

        return (
            <div className="cart-item">
                <div className="item-name">Name: {item_name[0]}</div>
                <div className="item-quantity">Quantity: {item_name[1]}</div>
                <div className="item-price">Price: ${item_name[2]}</div>
                {size && <div className="item-size">Size: {size}</div>}
                {temp && <div className="item-temp">Temperature: {temp}</div>}
                {add_ons && <div className="item-add-ons">Add-ons: {renderSubItems(add_ons)}</div>}
                {milk_type && <div className="item-milk-type">Milk Type: {renderSubItems(milk_type)}</div>}
                {sweeteners && <div className="item-sweeteners">Sweeteners: {renderSubItems(sweeteners)}</div>}
            </div>
        );
    };

    return (
        <div className="order-log">
            <strong>Your Order</strong>
            <div className="cart-items-list">
                {cartItems.length > 0 ? (
                    cartItems.map(item => renderItemDetails(item))
                ) : (
                    <div>No items in the cart</div>
                )}
            </div>
        </div>
    );
};

export default OrderScreen;
