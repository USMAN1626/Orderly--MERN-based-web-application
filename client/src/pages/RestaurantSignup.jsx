
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';


const RestaurantSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        restaurantName: '',
        restaurantUrl: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {

            const response = await axiosInstance.post('/restaurant/register', formData);

            if (response.status === 201 || response.status === 200) {
                setMessage('Restaurant registered successfully! Please login.');
                console.log('Restaurant signup successful:', response.data);
                setTimeout(() => navigate('/restaurantlogin'), 1500);
            }
        } catch (err) {
            console.error('Restaurant Signup Error:', err);
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center py-5 bg-light">
                <div className="card p-4 shadow-lg rounded-4" style={{ maxWidth: '600px', width: '100%' }}>
                    <div className="card-body p-4">
                        <h2 className="card-title text-center mb-4">Register Your Restaurant</h2>
                        <form onSubmit={handleSubmit}>
                            {message && (
                                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="firstName" className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="lastName" className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control rounded-pill"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control rounded-pill"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="form-text">Your password must be at least 6 characters long.</div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control rounded-pill"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <hr className="my-4" />

                            <div className="mb-3">
                                <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="restaurantName"
                                    name="restaurantName"
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="restaurantUrl" className="form-label">Restaurant Website/URL (Optional)</label>
                                <input
                                    type="url"
                                    className="form-control rounded-pill"
                                    id="restaurantUrl"
                                    name="restaurantUrl"
                                    value={formData.restaurantUrl}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary btn-lg rounded-pill" disabled={loading}>
                                    {loading ? 'Registering...' : 'Register Restaurant'}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <p className="mb-0">
                                Already have an account?{' '}
                                <a href="/restaurantlogin" className="text-decoration-none">Login here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default RestaurantSignup;
