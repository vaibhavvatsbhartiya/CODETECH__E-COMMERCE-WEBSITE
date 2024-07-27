import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, qty) => {
        const itemExists = cartItems.find((item) => item.product === product);
        if (itemExists) {
            setCartItems(
                cartItems.map((item) =>
                    item.product === product ? { ...item, qty } : item
                )
            );
        } else {
            setCartItems([...cartItems, { product, qty }]);
        }
    };

    const removeFromCart = (product) => {
        setCartItems(cartItems.filter((item) => item.product !== product));
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
