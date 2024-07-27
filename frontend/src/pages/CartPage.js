import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CartPage() {
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

    return (
        <div>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.product}>
                        <h4>{item.name}</h4>
                        <p>${item.price}</p>
                        <button onClick={() => addToCart(item.product, item.qty + 1)}>+</button>
                        <button onClick={() => removeFromCart(item.product)}>-</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default CartPage;
