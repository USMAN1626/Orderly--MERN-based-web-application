import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import AddFoodItem from './pages/AddFoodItem';
import CustomerSignup from './pages/CustomerSignup';
import CustomerLogin from './pages/CustomerLogin';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantSignup from './pages/RestaurantSignup';
import RestaurantDashboard from './pages/RestaurantDashboard';
import OrderReceipt from './pages/OrderReceipt';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import CartPage from './components/CartPage';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentSuccess from './components/PaymentSuccess';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customersignup" element={<CustomerSignup />} />
            <Route path="/customerlogin" element={<CustomerLogin />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderreceipt" element={<OrderReceipt />} />
            <Route path="/restaurantsignup" element={<RestaurantSignup />} />
            <Route path="/restaurantlogin" element={<RestaurantLogin />} />
            <Route path="/restdashboard" element={<RestaurantDashboard />} />
            <Route path="/addfooditems" element={<AddFoodItem />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
