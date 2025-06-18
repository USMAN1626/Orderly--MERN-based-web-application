import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { getDashboardAnalytics } from '../api/analytics';

import Header from '../components/Header';
import Footer from '../components/Footer';

const RestaurantDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [analytics, setAnalytics] = useState(null);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'analytics'

    const restaurantName = localStorage.getItem('restaurantName');
    const restaurantEmail = localStorage.getItem('restaurantEmail');
    const restaurantId = localStorage.getItem('restaurantId');

    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get(`/receipt/restaurant/${restaurantId}`);
            console.log('Fetched restaurant orders:', res.data);
            setOrders(res.data);
            setMessage('');
        } catch (err) {
            console.error('Error fetching restaurant orders:', err);
            setMessage('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!restaurantId || !restaurantName || !restaurantEmail) {
            setMessage('You must be logged in to access the dashboard!');
            console.warn('Restaurant not logged in. Redirecting to login.');
            setTimeout(() => navigate('/restaurantlogin'), 1500);
            return;
        }

        fetchOrders();
    }, [restaurantId, restaurantName, restaurantEmail, navigate]);

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axiosInstance.delete(`/receipt/${orderId}`);
                setMessage('Order deleted successfully!');
                // Refresh orders list
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
                setMessage('Failed to delete order. Please try again.');
            }
        }
    };

    const handleMarkAsCompleted = async (orderId) => {
        try {
            await axiosInstance.put(`/receipt/${orderId}/complete`);
            setMessage('Order marked as completed!');
            // Refresh orders list
            fetchOrders();
        } catch (error) {
            console.error('Error updating order:', error);
            setMessage('Failed to update order status. Please try again.');
        }
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const analyticsData = await getDashboardAnalytics();
                setAnalytics(analyticsData);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setMessage('Failed to load analytics. Please try again.');
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <>
            <Header />
            <div className="container-fluid min-vh-100 py-5 bg-light">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-lg p-4 mb-4 rounded-4">
                            <h1 className="text-center mb-3">Restaurant Dashboard</h1>
                            <p className="lead text-center">Welcome, <strong>{restaurantName || 'Restaurant'}</strong>!</p>
                            {message && (
                                <div className={`alert ${message.includes('successful') || message.includes('Welcome') ? 'alert-success' : 'alert-danger'} text-center`}>
                                    {message}
                                </div>
                            )}
                        </div>

                        <div className="row">
                            {/* Left Sidebar */}
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3 mb-4 rounded-4 sticky-top" style={{ top: '80px' }}>
                                    <h5 className="mb-3">Navigation</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}>View Orders</a>
                                        </li>
                                        <li className="list-group-item">
                                            <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}>Analytics</a>
                                        </li>
                                        <li className="list-group-item">
                                            <a href="/addfooditems" className="text-decoration-none">Manage Menu</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="col-md-9">
                                {activeTab === 'orders' ? (
                                    <div className="card shadow-lg p-4 rounded-4">
                                        <h2 className="mb-4">Order Management</h2>
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading orders...</span>
                                                </div>
                                                <p className="mt-2">Loading orders...</p>
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <p className="text-center text-muted py-4">No orders found yet for your restaurant.</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-striped table-hover caption-top">
                                                    <caption>List of orders</caption>
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Customer Email</th>
                                                            <th>Food Items</th>
                                                            <th>Total Price</th>
                                                            <th>Order Date</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map((order) => (
                                                            <tr key={order._id}>
                                                                <td>{order._id}</td>
                                                                <td>{order.email || 'Unknown'}</td>
                                                                <td>
                                                                    {order.cart && order.cart.map(item => `${item.foodName} (x${item.quantity})`).join(', ')}
                                                                </td>
                                                                <td>Rs. {order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</td>
                                                                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
                                                                <td>
                                                                    <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                                                                        {order.status || 'pending'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className="btn-group" role="group">
                                                                        {order.status !== 'completed' && (
                                                                            <button
                                                                                className="btn btn-success btn-sm"
                                                                                onClick={() => handleMarkAsCompleted(order._id)}
                                                                            >
                                                                                Complete
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            className="btn btn-danger btn-sm ms-2"
                                                                            onClick={() => handleDeleteOrder(order._id)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="card shadow-lg p-4 rounded-4">
                                        <h2 className="mb-4">Analytics Dashboard</h2>
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading analytics...</span>
                                                </div>
                                                <p className="mt-2">Loading analytics...</p>
                                            </div>
                                        ) : analytics ? (
                                            <div className="row">
                                                <div className="col-md-6 mb-4">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Total Restaurants</h5>
                                                            <p className="card-text display-4">{analytics.totalRestaurants}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Total Menu Items</h5>
                                                            <p className="card-text display-4">{analytics.totalMenuItems}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Total Orders</h5>
                                                            <p className="card-text display-4">{analytics.totalOrders}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Total Revenue</h5>
                                                            <p className="card-text display-4">Rs. {analytics.totalRevenue?.toFixed(2) || '0.00'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Average Menu Item Price</h5>
                                                            <p className="card-text display-4">Rs. {analytics.averagePrice?.toFixed(2) || '0.00'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Most Popular Restaurant</h5>
                                                            <p className="card-text display-6">{analytics.popularRestaurant ? analytics.popularRestaurant.restaurantName : 'N/A'}</p>
                                                            {analytics.popularRestaurant && (
                                                                <p className="card-text text-muted">Orders: {analytics.popularRestaurant.orderCount}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-center text-muted py-4">No analytics data available.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RestaurantDashboard;
