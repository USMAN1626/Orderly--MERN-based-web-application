import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, userType, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/img/computer.png" alt="Food Delivery Logo" width="50" height="30" className="me-2 rounded-circle" />
                    <span className="fw-bold text-primary">A&A MUNCHING</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart">
                                <img src="/img/cart.png" alt="Cart" width="24" height="24" className="me-1" />
                                Cart
                            </Link>
                        </li>

                        {!isAuthenticated && (
                            <>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Login / Signup
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item" to="/customerlogin">Customer Login</Link></li>
                                        <li><Link className="dropdown-item" to="/customersignup">Customer Signup</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><Link className="dropdown-item" to="/restaurantlogin">Restaurant Login</Link></li>
                                        <li><Link className="dropdown-item" to="/restaurantsignup">Restaurant Signup</Link></li>
                                    </ul>
                                </li>
                            </>
                        )}

                        {isAuthenticated && userType === 'customer' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orderreceipt">My Orders</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link text-success fw-bold">Welcome, {user.email}!</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}

                        {isAuthenticated && userType === 'restaurant' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/restdashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link text-info fw-bold">Welcome, {user.name}!</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
