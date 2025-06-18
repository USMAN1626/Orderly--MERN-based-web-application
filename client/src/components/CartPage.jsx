import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

const CartPage = () => {
    const { isAuthenticated, user, userType } = useAuth();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const customerEmail = isAuthenticated && userType === 'customer' ? user.email : null;

    useEffect(() => {
        if (!customerEmail) {
            setMessage('Please log in as a customer to view your cart.');
            setTimeout(() => navigate('/customerlogin'), 1500);
            return;
        }

        const fetchCart = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/cart/${customerEmail}`);
                setCartItems(res.data.items);
                calculateTotal(res.data.items);
                setMessage('');
            } catch (err) {
                console.error('Error fetching cart:', err);
                setMessage(err.response?.data?.message || 'Failed to load cart items.');
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [customerEmail, isAuthenticated, userType, navigate]);

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = async (foodId, newQuantity) => {
        if (!customerEmail) return;

        if (newQuantity < 0) return;

        setLoading(true);
        try {
            const res = await axiosInstance.put(`/cart/${customerEmail}/${foodId}`, { quantity: newQuantity });
            setCartItems(res.data.cart.items);
            calculateTotal(res.data.cart.items);
            setMessage('Quantity updated.');
        } catch (err) {
            console.error('Error updating quantity:', err);
            setMessage(err.response?.data?.message || 'Failed to update quantity.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleRemoveItem = async (foodId) => {
        if (!customerEmail) return;

        setLoading(true);
        try {
            const res = await axiosInstance.delete(`/cart/${customerEmail}/${foodId}`);
            setCartItems(res.data.cart.items);
            calculateTotal(res.data.cart.items);
            setMessage('Item removed from cart.');
        } catch (err) {
            console.error('Error removing item:', err);
            setMessage(err.response?.data?.message || 'Failed to remove item.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleClearCart = async () => {
        if (!customerEmail) return;

        if (!window.confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.delete(`/cart/${customerEmail}`);
            setCartItems(res.data.cart.items);
            calculateTotal(res.data.cart.items);
            setMessage('Cart cleared.');
        } catch (err) {
            console.error('Error clearing cart:', err);
            setMessage(err.response?.data?.message || 'Failed to clear cart.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            setMessage('Your cart is empty. Please add items before proceeding to checkout.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        navigate('/checkout', { state: { cartItems, totalPrice } });
    };

    return (
        <>
            <Header />
            <main className="container py-5 bg-light" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-lg p-4 rounded-4">
                            <h1 className="card-title text-center mb-4 text-primary">Your Shopping Cart</h1>

                            {message && (
                                <div className={`alert ${message.includes('successful') || message.includes('updated') || message.includes('removed') || message.includes('cleared') ? 'alert-success' : 'alert-danger'} text-center mb-3 fade show`} role="alert">
                                    {message}
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading cart...</span>
                                    </div>
                                    <p className="mt-2">Loading your cart...</p>
                                </div>
                            ) : cartItems.length === 0 ? (
                                <p className="text-center text-muted py-4">Your cart is currently empty. Start adding some delicious food!</p>
                            ) : (
                                <div className="table-responsive mb-4">
                                    <table className="table table-striped table-hover align-middle">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col">Food Item</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Subtotal</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map(item => (
                                                <tr key={item.foodId}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span>{item.foodName}</span>
                                                        </div>
                                                    </td>
                                                    <td>Rs. {item.price.toFixed(2)}</td>
                                                    <td>
                                                        <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => handleQuantityChange(item.foodId, item.quantity - 1)}
                                                                disabled={loading}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="form-control text-center"
                                                                value={item.quantity}
                                                                readOnly
                                                                style={{ maxWidth: '40px' }}
                                                            />
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => handleQuantityChange(item.foodId, item.quantity + 1)}
                                                                disabled={loading}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm rounded-pill"
                                                            onClick={() => handleRemoveItem(item.foodId)}
                                                            disabled={loading}
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold">Total:</td>
                                                <td className="fw-bold">Rs. {totalPrice.toFixed(2)}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-4">
                                <button className="btn btn-secondary rounded-pill" onClick={() => navigate('/')}>
                                    Continue Shopping
                                </button>
                                {cartItems.length > 0 && (
                                    <button className="btn btn-warning rounded-pill" onClick={handleClearCart} disabled={loading}>
                                        Clear Cart
                                    </button>
                                )}
                                <button
                                    className="btn btn-primary rounded-pill btn-lg"
                                    onClick={handleProceedToCheckout}
                                    disabled={loading || cartItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CartPage;
