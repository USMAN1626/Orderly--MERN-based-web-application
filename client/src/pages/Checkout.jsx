import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import PaymentForm from '../components/PaymentForm';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, userType } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        phone: '',
        email: user?.email || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [cartDetails, setCartDetails] = useState({ items: [], totalPrice: 0 });
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || userType !== 'customer') {
            setMessage('Please log in as a customer to proceed to checkout.');
            setTimeout(() => navigate('/customerlogin'), 1500);
            return;
        }

        if (location.state && location.state.cartItems && location.state.totalPrice) {
            setCartDetails({
                items: location.state.cartItems,
                totalPrice: location.state.totalPrice
            });
        } else {
            const fetchCartFallback = async () => {
                setLoading(true);
                try {
                    const res = await axiosInstance.get(`/cart/${user.email}`);
                    setCartDetails({
                        items: res.data.items,
                        totalPrice: res.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    });
                } catch (err) {
                    console.error('Error fetching cart fallback:', err);
                    setMessage('Failed to load cart for checkout. Please go back to cart page.');
                    setTimeout(() => navigate('/cart'), 2000);
                } finally {
                    setLoading(false);
                }
            };
            fetchCartFallback();
        }

        if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [isAuthenticated, user, userType, location.state, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeliverySubmit = async (e) => {
        e.preventDefault();
        
        // Store delivery information in localStorage
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);
        localStorage.setItem('streetAddress', formData.streetAddress);
        localStorage.setItem('city', formData.city);
        localStorage.setItem('phone', formData.phone);
        
        setShowPayment(true);
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        setMessage('');

        if (cartDetails.items.length === 0) {
            setMessage('Your cart is empty. Cannot place an empty order.');
            setLoading(false);
            return;
        }

        const defaultRestaurantId = localStorage.getItem('restaurantIdForOrders') || "684f01e5eec98de8aa9afe60";
        const defaultRestaurantName = localStorage.getItem('restaurantNameForOrders') || "ChinchKopliBandar";

        try {
            const orderPayload = {
                ...formData,
                totalPrice: cartDetails.totalPrice,
                cart: cartDetails.items.map(item => ({
                    foodName: item.foodName,
                    quantity: item.quantity,
                    price: item.price
                })),
                restaurantId: defaultRestaurantId,
                restaurantName: defaultRestaurantName,
                paymentStatus: 'paid'
            };

            const response = await axiosInstance.post('/receipt', orderPayload);

            if (response.status === 201) {
                setMessage('Order placed successfully! Redirecting to order receipt.');
                console.log('Order placed:', response.data);
                await axiosInstance.delete(`/cart/${user.email}`);
                localStorage.removeItem('cart');
                setTimeout(() => navigate('/orderreceipt'), 2000);
            }
        } catch (err) {
            console.error('Error placing order:', err);
            const errorMessage = err.response?.data?.message || 'Failed to place order. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="container py-5 bg-light" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading checkout...</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="container py-5 bg-light" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="card shadow-lg p-4 rounded-4">
                            <h1 className="card-title text-center mb-4 text-primary">Checkout</h1>
                            {message && (
                                <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center mb-3 fade show`} role="alert">
                                    {message}
                                </div>
                            )}

                            <h3 className="mb-3">Order Summary</h3>
                            <ul className="list-group mb-4">
                                {cartDetails.items.length === 0 ? (
                                    <li className="list-group-item text-center text-muted">No items in cart to checkout.</li>
                                ) : (
                                    cartDetails.items.map(item => (
                                        <li key={item.foodId} className="list-group-item d-flex justify-content-between align-items-center">
                                            {item.foodName} (x{item.quantity})
                                            <span className="badge bg-primary rounded-pill">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))
                                )}
                                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold bg-light">
                                    Total:
                                    <span>Rs. {cartDetails.totalPrice.toFixed(2)}</span>
                                </li>
                            </ul>

                            {!showPayment ? (
                                <>
                                    <h3 className="mb-3">Delivery Information</h3>
                                    <form onSubmit={handleDeliverySubmit}>
                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input type="text" className="form-control rounded-pill" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input type="text" className="form-control rounded-pill" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control rounded-pill" id="email" name="email" value={formData.email} onChange={handleChange} required readOnly={user?.email ? true : false} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="streetAddress" className="form-label">Street Address</label>
                                            <input type="text" className="form-control rounded-pill" id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="city" className="form-label">City</label>
                                            <input type="text" className="form-control rounded-pill" id="city" name="city" value={formData.city} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="phone" className="form-label">Phone</label>
                                            <input type="tel" className="form-control rounded-pill" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                                        </div>

                                        <div className="d-grid">
                                            <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={loading || cartDetails.items.length === 0}>
                                                Proceed to Payment
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="mt-4">
                                    <h3 className="mb-3">Payment Information</h3>
                                    <PaymentForm 
                                        amount={cartDetails.totalPrice} 
                                        onSuccess={handlePaymentSuccess}
                                        orderDetails={{
                                            ...formData,
                                            cart: cartDetails.items.map(item => ({
                                                foodName: item.foodName,
                                                quantity: item.quantity,
                                                price: item.price
                                            })),
                                            restaurantId: localStorage.getItem('restaurantIdForOrders') || "684f01e5eec98de8aa9afe60",
                                            restaurantName: localStorage.getItem('restaurantNameForOrders') || "ChinchKopliBandar",
                                            paymentStatus: 'paid'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Checkout;
