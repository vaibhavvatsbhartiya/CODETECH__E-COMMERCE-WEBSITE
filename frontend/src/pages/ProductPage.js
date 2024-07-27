import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductPage({ match }) {
    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`/api/products/${match.params.id}`);
            setProduct(data);
        };

        fetchProduct();
    }, [match]);

    return (
        <div>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
        </div>
    );
}

export default ProductPage;
