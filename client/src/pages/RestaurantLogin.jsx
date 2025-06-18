
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';



const RestaurantLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {

            const { data } = await axiosInstance.post('/restaurant/login', { email, password });

            setMessage('Login successful!');
            console.log('Restaurant login successful:', data);
            localStorage.setItem('restaurantLoggedIn', 'true');
            localStorage.setItem('restaurantId', data.restaurantId);
            localStorage.setItem('restaurantName', data.restaurantName);
            localStorage.setItem('restaurantEmail', data.email);

            setTimeout(() => navigate('/restdashboard'), 1500);
        } catch (error) {
            console.error('Restaurant Login error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred during login. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center py-5 bg-light">
                <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 className="card-title text-center mb-4">Login to Your Restaurant</h2>
                    <form onSubmit={handleLogin}>
                        {message && (
                            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                                {message}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control rounded-pill"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control rounded-pill"
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
                            <p className="mb-0">
                                Don't have an account?{' '}
                                <a href="/restaurantsignup" className="text-decoration-none">Register here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
};

export default RestaurantLogin;
