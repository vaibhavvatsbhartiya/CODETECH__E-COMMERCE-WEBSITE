import React, { useState, useEffect } from 'react';
import Product from './Product';
import axios from 'axios';

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');
            setProducts(data);
        };

        fetchProducts();
    }, []);

    return (
        <div>
            {products.map((product) => (
                <Product key={product._id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
