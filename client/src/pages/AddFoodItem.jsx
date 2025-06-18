import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AddFoodItem = () => {
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        price: '',
        imageUrl: ''
    });

    useEffect(() => {
        const restaurantId = localStorage.getItem('restaurantId');
        console.log('Restaurant ID from localStorage:', restaurantId);
        
        if (!restaurantId) {
            console.log('No restaurant ID found in localStorage');
            setMessage('Restaurant ID not found. Please log in again.');
            setTimeout(() => navigate('/restaurantlogin'), 2000);
            return;
        }

        // Test the restaurant ID format
        if (!/^[0-9a-fA-F]{24}$/.test(restaurantId)) {
            console.log('Invalid restaurant ID format:', restaurantId);
            setMessage('Invalid restaurant ID format. Please log in again.');
            setTimeout(() => navigate('/restaurantlogin'), 2000);
            return;
        }

        fetchMenuItems(restaurantId);
    }, [navigate]);

    const fetchMenuItems = async (restaurantId) => {
        try {
            console.log('Current restaurant ID from localStorage:', restaurantId);
            console.log('Making API request to:', `/fooditems/restaurant/${restaurantId}`);
            const res = await axiosInstance.get(`/fooditems/restaurant/${restaurantId}`);
            console.log('API Response:', res.data);
            setMenuItems(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu items:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                restaurantId: restaurantId
            });
            setMessage('Failed to load menu items. Please try again.');
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setEditForm({
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl || ''
        });
    };

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const restaurantId = localStorage.getItem('restaurantId');
            if (!restaurantId) {
                setMessage('Restaurant ID not found. Please log in again.');
                return;
            }

            await axiosInstance.put(`/fooditems/${editingItem._id}`, {
                ...editForm,
                restaurant: restaurantId
            });
            setMessage('Food item updated successfully!');
            setEditingItem(null);
            fetchMenuItems(restaurantId);
        } catch (error) {
            console.error('Error updating food item:', error);
            setMessage('Failed to update food item. Please try again.');
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const restaurantId = localStorage.getItem('restaurantId');
                if (!restaurantId) {
                    setMessage('Restaurant ID not found. Please log in again.');
                    return;
                }

                await axiosInstance.delete(`/fooditems/${itemId}`);
                setMessage('Food item deleted successfully!');
                fetchMenuItems(restaurantId);
            } catch (error) {
                console.error('Error deleting food item:', error);
                setMessage('Failed to delete food item. Please try again.');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="container-fluid min-vh-100 py-5 bg-light">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-lg p-4 mb-4 rounded-4">
                            <h2 className="text-center mb-4">Manage Menu Items</h2>
                            {message && (
                                <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center`}>
                                    {message}
                                </div>
                            )}

                            {editingItem && (
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h4 className="card-title mb-3">Edit Menu Item</h4>
                                        <form onSubmit={handleEditSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="name"
                                                        value={editForm.name}
                                                        onChange={handleEditChange}
                                                        placeholder="Food Name"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="price"
                                                        value={editForm.price}
                                                        onChange={handleEditChange}
                                                        placeholder="Price"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <input
                                                        type="url"
                                                        className="form-control"
                                                        name="imageUrl"
                                                        value={editForm.imageUrl}
                                                        onChange={handleEditChange}
                                                        placeholder="Image URL (optional)"
                                                    />
                                                </div>
                                                <div className="col-12 text-center">
                                                    <button type="submit" className="btn btn-primary me-2">
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => {
                                                            setEditingItem(null);
                                                            setEditForm({
                                                                name: '',
                                                                price: '',
                                                                imageUrl: ''
                                                            });
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <h3 className="mb-4">Current Menu Items</h3>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : menuItems.length === 0 ? (
                                <p className="text-center text-muted">No menu items found.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {menuItems.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        {item.imageUrl ? (
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                className="rounded"
                                                            />
                                                        ) : (
                                                            <div className="bg-secondary text-white rounded" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                No Image
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>Rs. {item.price}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary me-2"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AddFoodItem;
