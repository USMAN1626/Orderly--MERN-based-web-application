import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CustomerSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/customer/signup', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 201 || response.status === 200) {
                setMessage('Signup successful! Please login.');
                console.log('Signup successful!', response.data);
                setTimeout(() => navigate('/customerlogin'), 1500);
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred during signup. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center py-5 bg-light">
                <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="card-body p-4">
                        <h2 className="card-title text-center mb-4">Create Your Account</h2>
                        <form onSubmit={handleSubmit}>
                            {message && (
                                <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className={`form-control rounded-pill ${errors.username ? 'is-invalid' : ''}`}
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    required
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className={`form-control rounded-pill ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className={`form-control rounded-pill ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                <div className="form-text">Password must be at least 6 characters long.</div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className={`form-control rounded-pill ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                            </div>

                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>

                            <div className="text-center mt-3">
                                <p className="mb-0">
                                    Already have an account?{' '}
                                    <a href="/customerlogin" className="text-decoration-none">Login here</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CustomerSignup;
