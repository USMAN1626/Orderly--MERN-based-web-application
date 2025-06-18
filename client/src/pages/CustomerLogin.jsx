import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/customer/login', {
                email,
                password
            });

            if (response.status === 200) {
                const result = response.data;
                setMessage('Login successful!');
                console.log('Login successful:', result);

                // Store user information in localStorage
                localStorage.setItem('userEmail', result.email);
                localStorage.setItem('userId', result.customerId);
                localStorage.setItem('token', result.token || 'dummy-token'); // Add token if available

                // Call the login function from AuthContext
                login({ id: result.customerId, email: result.email }, 'customer');

                // Check if there's a pending payment
                const pendingPayment = localStorage.getItem('pendingPayment');
                if (pendingPayment) {
                    localStorage.removeItem('pendingPayment');
                    setTimeout(() => navigate('/orderreceipt'), 1500);
                } else {
                    setTimeout(() => navigate('/'), 1500);
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred during login. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/customer/reset-password-request', { email });
            setMessage(response.data.message);
            console.log('Password reset request:', response.data.message);
        } catch (err) {
            console.error('Password reset request error:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred during password reset request. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center py-5 bg-light">
                {showForgotPassword ? (
                    <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h3 className="card-title text-center mb-4">Reset Your Password</h3>
                        <form onSubmit={handleReset}>
                            <div className="mb-3">
                                <label htmlFor="resetEmail" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="resetEmail"
                                    className="form-control rounded-pill"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 rounded-pill mb-2" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <button type="button" className="btn btn-secondary w-100 rounded-pill" onClick={() => setShowForgotPassword(false)}>
                                Back to Login
                            </button>
                        </form>
                        {message && <p className="text-center mt-3">{message}</p>}
                    </div>
                ) : (
                    <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                        <h2 className="card-title text-center mb-4">Customer Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="loginEmail" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="loginEmail"
                                    className="form-control rounded-pill"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="loginPassword" className="form-label">Password:</label>
                                <input
                                    type="password"
                                    id="loginPassword"
                                    className="form-control rounded-pill"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 rounded-pill mb-3" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <div className="text-center">
                                <a href="#" className="text-decoration-none" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>
                                    Lost your password?
                                </a>
                            </div>
                        </form>
                        {message && <p className="text-center mt-3">{message}</p>}
                        <div className="text-center mt-3">
                            <p className="mb-0">
                                Don't have an account?{' '}
                                <a href="/customersignup" className="text-decoration-none">Sign Up here</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CustomerLogin;
