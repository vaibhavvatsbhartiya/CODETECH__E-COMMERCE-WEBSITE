import React from 'react';
import { Link } from 'react-router-dom';

function Product({ product }) {
    return (
        <div>
            <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
            </Link>
            <div>
                <Link to={`/product/${product._id}`}>
                    <strong>{product.name}</strong>
                </Link>
                <p>${product.price}</p>
            </div>
        </div>
    );
}

export default Product;
