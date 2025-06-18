import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const RestaurantProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        businessHours: {
            open: '09:00',
            close: '22:00'
        }
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const restaurantId = localStorage.getItem('restaurantId');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(`/restaurant/${restaurantId}`);
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                setMessage('Failed to load profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [restaurantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.put(`/restaurant/${restaurantId}`, profile);
            setMessage('Profile updated successfully!');
            setLoading(false);
        } catch (error) {
            setMessage('Failed to update profile');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfile(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setProfile(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading profile...</div>;
    }

    return (
        <div className="card shadow-lg p-4 rounded-4">
            <h2 className="mb-4">Restaurant Profile</h2>
            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-4`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Restaurant Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="open" className="form-label">Opening Time</label>
                        <input
                            type="time"
                            className="form-control"
                            id="open"
                            name="businessHours.open"
                            value={profile.businessHours.open}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="close" className="form-label">Closing Time</label>
                        <input
                            type="time"
                            className="form-control"
                            id="close"
                            name="businessHours.close"
                            value={profile.businessHours.close}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default RestaurantProfile; 