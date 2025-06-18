import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const OrderReceipt = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, userType } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated || userType !== 'customer' || !user?.email) {
                console.log('User not authenticated or not a customer');
                setMessage('Please log in as a customer to view your orders.');
                setTimeout(() => navigate('/customerlogin'), 1500);
                return;
            }

            try {
                console.log('Fetching orders for:', user.email);
                const res = await axiosInstance.get(`/receipt/${user.email}`);
                console.log('Raw orders data:', JSON.stringify(res.data, null, 2));
                
                // Process orders to ensure total price is calculated correctly
                const processedOrders = res.data.map(order => {
                    console.log('Processing order:', JSON.stringify(order, null, 2));
                    
                    // Calculate total from cart items
                    const calculatedTotal = order.cart.reduce((sum, item) => {
                        const price = parseFloat(item.price) || 0;
                        const quantity = parseInt(item.quantity) || 0;
                        const itemTotal = price * quantity;
                        console.log(`Item: ${item.foodName}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`);
                        return sum + itemTotal;
                    }, 0);
                    
                    console.log('Calculated total for order:', calculatedTotal);
                    
                    return {
                        ...order,
                        totalPrice: calculatedTotal
                    };
                });
                
                console.log('Processed orders with totals:', JSON.stringify(processedOrders, null, 2));
                setOrders(processedOrders);
                setMessage('');
            } catch (err) {
                console.error('Error fetching orders:', err);
                setMessage('Failed to load your orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, user, userType, navigate]);

    return (
        <>
            <Header />
            <main className="container py-5 bg-light" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-11 col-sm-12">
                        <div className="card shadow-lg p-4 rounded-4">
                            <h1 className="card-title text-center mb-4 display-5 fw-bold text-primary">My Orders</h1>

                            {message && (
                                <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center mb-3 fade show`} role="alert">
                                    {message}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading orders...</span>
                                    </div>
                                    <p className="mt-2">Loading your orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <p className="text-center text-muted py-4">You have not placed any orders yet.</p>
                            ) : (
                                <div className="accordion" id="ordersAccordion">
                                    {orders.map((order, orderIdx) => (
                                        <div className="accordion-item mb-3 border-0 shadow-sm rounded-3 overflow-hidden" key={order._id || orderIdx}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button collapsed bg-white text-dark py-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse${order._id || orderIdx}`}
                                                    aria-expanded="false"
                                                    aria-controls={`collapse${order._id || orderIdx}`}
                                                >
                                                    <div className="d-flex w-100 justify-content-between align-items-center flex-wrap">
                                                        <span className="fw-bold me-3 fs-5">Order #{orderIdx + 1}</span>
                                                        <span className="text-muted text-sm">
                                                            Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                </button>
                                            </h2>
                                            <div
                                                id={`collapse${order._id || orderIdx}`}
                                                className="accordion-collapse collapse"
                                                aria-labelledby={`heading${order._id || orderIdx}`}
                                                data-bs-parent="#ordersAccordion"
                                            >
                                                <div className="accordion-body bg-light p-4 border-top">
                                                    <h4 className="mb-3 text-secondary">Delivery Details:</h4>
                                                    <ul className="list-group list-group-flush mb-4">
                                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <span><strong>Name:</strong></span>
                                                            <span>{order.firstName} {order.lastName}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <span><strong>Email:</strong></span>
                                                            <span>{order.email}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <span><strong>Phone:</strong></span>
                                                            <span>{order.phone}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <span><strong>Address:</strong></span>
                                                            <span>{order.streetAddress}, {order.city}</span>
                                                        </li>
                                                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                                            <span><strong>Restaurant:</strong></span>
                                                            <span>{order.restaurantName || 'N/A'}</span>
                                                        </li>
                                                    </ul>

                                                    <h4 className="mb-3 text-secondary">Items Ordered:</h4>
                                                    <ul className="list-group mb-4 border rounded overflow-hidden">
                                                        {order.cart && order.cart.map((item, itemIdx) => (
                                                            <li className="list-group-item d-flex justify-content-between align-items-center py-2" key={itemIdx}>
                                                                <span className="fw-medium">{item.foodName} <span className="text-muted">(x{item.quantity})</span></span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="d-grid mt-4">
                                <button className="btn btn-secondary rounded-pill btn-lg" onClick={() => navigate('/')}>
                                    Back to Main Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default OrderReceipt;
