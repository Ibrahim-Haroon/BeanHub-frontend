import React from 'react';
import '../styles/OrderScreen.css';

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

        const displayMilkType = milk_type && milk_type.some(milk => milk[0] !== 'regular');

        return (
            <div className="cart-item">
                <div className="item-name">Name: {item_name[0]}</div>
                <div className="item-quantity">Quantity: {item_name[1]}</div>
                <div className="item-price">Price: ${item_name[2]}</div>
                {size && size !== "regular" && <div className="item-size">Size: {size}</div>}
                {temp && temp !== "regular" && <div className="item-temp">Temperature: {temp}</div>}
                {add_ons && add_ons.length > 0 && <div className="item-add-ons">Add-ons: {renderSubItems(add_ons)}</div>}
                {displayMilkType && <div className="item-milk-type">Milk Type: {renderSubItems(milk_type)}</div>}
                {sweeteners && sweeteners.length > 0 && <div className="item-sweeteners">Sweeteners: {renderSubItems(sweeteners)}</div>}
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
