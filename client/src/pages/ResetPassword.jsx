
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../css/resetpass.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password should be at least 6 characters long');
            return;
        }

        try {
            const { data } = await axiosInstance.post('/api/customer/reset-password', {
                token,
                newPassword: password,
            });
            alert('Password reset successful');
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            alert(`Error: ${error.response?.data?.message || 'Try again later'}`);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-reset">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
