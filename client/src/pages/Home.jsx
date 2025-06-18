import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user, userType } = useAuth();
    const [allFoodItems, setAllFoodItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [addToCartMessage, setAddToCartMessage] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        axiosInstance.get('/fooditems')
            .then(res => {
                console.log('Data fetched:', res.data);
                // Log each item's image field
                res.data.forEach(item => {
                    console.log(`Item: ${item.name}, Image: ${item.image}, Category: ${item.category}`);
                });
                setAllFoodItems(res.data);
                setFilteredItems(res.data);
            })
            .catch(err => console.error('Error fetching food items:', err));
    }, []);

    const addToCart = async (foodId, foodName, foodPrice) => {
        if (!isAuthenticated || userType !== 'customer') {
            setAddToCartMessage('Please log in as a customer to add items to cart.');
            setTimeout(() => setAddToCartMessage(''), 3000);
            return;
        }

        const customerEmail = user.email;
        if (!customerEmail) {
            setAddToCartMessage('Customer email not found. Please re-login.');
            setTimeout(() => setAddToCartMessage(''), 3000);
            return;
        }

        try {
            const response = await axiosInstance.post('/cart', {
                foodId: foodId,
                customerEmail: customerEmail,
                quantity: 1
            });

            if (response.data.message) {
                setAddToCartMessage(`"${foodName}" added to cart!`);
                console.log('Cart response:', response.data);
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            const errorMessage = err.response?.data?.message || 'Error adding item to cart.';
            setAddToCartMessage(errorMessage);
        } finally {
            setTimeout(() => setAddToCartMessage(''), 3000);
        }
    };

    const filterByCategory = (category) => {
        setActiveCategory(category); // Set active category
        if (category === 'All') {
            setFilteredItems(allFoodItems);
        } else {
            const filtered = allFoodItems.filter(item =>
                item.category.toLowerCase() === category.toLowerCase()
            );
            setFilteredItems(filtered);
        }
    };

    return (
        <>
            <Header />
            {/* FIX: Changed container-fluid to container for fixed width with margins */}
            <main className="container py-5 bg-light" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 120px)' }}>
                {/* Hero Section - Using a standard Bootstrap dark background for a sleek look */}
                <section className="hero-section text-center py-5 mb-5 bg-dark rounded-4 shadow-lg text-white">
                    <div className="row align-items-center">
                        <div className="col-lg-7 px-4">
                            <h1 className="display-4 fw-bold mb-3">
                                Connecting You To Your Favorite Food & Restaurant
                            </h1>
                            <p className="lead mb-4">
                                Your favorite food is just a few clicks away from A&A Munching!
                            </p>
                            <button
                                className="btn btn-light btn-lg rounded-pill shadow-lg text-dark"
                                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                            >
                                Explore Menu
                            </button>
                        </div>
                        <div className="col-lg-5">
                            <img src="/img/image.png" alt="Food Delivery" className="img-fluid rounded-4 shadow-lg" />
                        </div>
                    </div>
                </section>

                {/* Add To Cart Message */}
                {addToCartMessage && (
                    <div className={`alert ${addToCartMessage.includes('added') ? 'alert-success' : 'alert-warning'} fade show text-center`} role="alert" style={{ position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 1050, width: 'fit-content', minWidth: '300px' }}>
                        {addToCartMessage}
                    </div>
                )}

                <section className="menu-section py-5">
                    <h2 className="text-center mb-5 display-5 fw-bold text-primary">Our Delicious Menu</h2>

                    <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
                        {['All', 'Burgers', 'Pizza', 'Dessert', 'Noodles', 'Sandwich', 'Asian', 'Pasta', 'Drinks', 'Desi'].map(cat => (
                            <button
                                key={cat}
                                className={`btn rounded-pill px-4 py-2 shadow-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => filterByCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                        {filteredItems.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <p className="lead text-muted">No items found in this category.</p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div className="col d-flex" key={item._id}>
                                    {/* Card with Bootstrap hover shadow for visual interaction */}
                                    <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden"
                                        style={{ transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', cursor: 'pointer' }} // Added box-shadow transition
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 .7rem 1.5rem rgba(0,0,0,.175)!important'; }} // Stronger shadow on hover
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)!important'; }} // Reset to initial shadow
                                    >
                                        <img
                                            src={`/images/${item.image || 'default.png'}`}
                                            className="card-img-top object-cover"
                                            alt={item.name}
                                            style={{ height: '200px' }}
                                            onError={(e) => {
                                                console.error('Image failed to load:', item.image, 'for item:', item.name);
                                                // Try alternative image paths
                                                if (e.target.src.includes('coca_cola.png')) {
                                                    e.target.src = '/images/cocacola.png';
                                                } else {
                                                    e.target.src = '/img/default.png';
                                                }
                                            }}
                                            onLoad={(e) => {
                                                console.log('Image loaded successfully:', item.image, 'for item:', item.name);
                                            }}
                                        />
                                        <div className="card-body d-flex flex-column p-4 bg-white">
                                            <h5 className="card-title fw-bold text-truncate mb-1 text-dark">{item.name}</h5>
                                            <p className="card-text text-muted mb-2">{item.restaurant}</p>
                                            <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                                                <span className="price fs-4 fw-bold text-success">Rs. {item.price}</span>
                                                <button
                                                    className="btn btn-primary rounded-pill px-4 py-2"
                                                    onClick={() => addToCart(item._id, item.name, item.price)}
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Home;
