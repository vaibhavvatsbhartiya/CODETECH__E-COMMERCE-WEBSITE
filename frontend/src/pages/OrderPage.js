import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderPage({ match }) {
    const [order, setOrder] = useState({});

    useEffect(() => {
        const fetchOrder = async () => {
            const { data } = await axios.get(`/api/orders/${match.params.id}`);
            setOrder(data);
        };

        fetchOrder();
    }, [match]);

    return (
        <div>
            <h1>Order {order._id}</h1>
            {/* Add your order details here */}
        </div>
    );
}

export default OrderPage;
