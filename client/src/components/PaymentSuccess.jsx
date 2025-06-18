import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Get payment_intent and payment_intent_client_secret from URL
        const paymentIntent = searchParams.get('payment_intent');
        const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

        if (paymentIntent && paymentIntentClientSecret) {
          // Payment was successful
          setStatus('success');
          
          // Store payment success in localStorage
          localStorage.setItem('lastPaymentSuccess', 'true');
          localStorage.setItem('lastPaymentIntent', paymentIntent);

          // Check if user is authenticated
          if (isAuthenticated && user) {
            console.log('User is authenticated:', user.email);
            
            try {
              // Get cart items from localStorage
              const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
              
              // Calculate total price with proper number conversion
              const totalPrice = cartItems.reduce((sum, item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 0;
                console.log(`Item: ${item.foodName}, Price: ${price}, Quantity: ${quantity}, Total: ${price * quantity}`);
                return sum + (price * quantity);
              }, 0);

              console.log('Calculated total price:', totalPrice);

              // Create order payload
              const orderPayload = {
                email: user.email,
                firstName: localStorage.getItem('firstName') || '',
                lastName: localStorage.getItem('lastName') || '',
                streetAddress: localStorage.getItem('streetAddress') || '',
                city: localStorage.getItem('city') || '',
                phone: localStorage.getItem('phone') || '',
                totalPrice: totalPrice,
                cart: cartItems.map(item => ({
                  foodName: item.foodName,
                  quantity: parseInt(item.quantity) || 0,
                  price: parseFloat(item.price) || 0
                })),
                restaurantId: localStorage.getItem('restaurantIdForOrders') || "684f01e5eec98de8aa9afe60",
                restaurantName: localStorage.getItem('restaurantNameForOrders') || "ChinchKopliBandar",
                paymentStatus: 'paid',
                paymentIntentId: paymentIntent
              };

              console.log('Saving order with total price:', totalPrice);

              // Save order to database
              const response = await axiosInstance.post('/receipt', orderPayload);
              console.log('Order saved:', response.data);

              // Clear cart
              localStorage.removeItem('cart');
              await axiosInstance.delete(`/cart/${user.email}`);

              // Wait 3 seconds to show success message
              setTimeout(() => {
                navigate('/orderreceipt');
              }, 3000);
            } catch (error) {
              console.error('Error saving order:', error);
              setStatus('error');
            }
          } else {
            console.log('User is not authenticated');
            setStatus('error');
            // Show error message for 3 seconds
            setTimeout(() => {
              navigate('/customerlogin');
            }, 3000);
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error handling payment success:', error);
        setStatus('error');
      }
    };

    handlePaymentSuccess();
  }, [navigate, searchParams, isAuthenticated, user]);

  if (status === 'processing') {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Processing Payment...</h2>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="alert alert-success" role="alert">
            <h2 className="alert-heading">Payment Successful!</h2>
            <p>Thank you for your payment. Your order has been confirmed.</p>
            <hr />
            <p className="mb-0">Redirecting you to your order receipt...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="alert alert-danger" role="alert">
          <h2 className="alert-heading">Authentication Required</h2>
          <p>Please log in to view your order receipt.</p>
          <hr />
          <p className="mb-0">Redirecting you to login...</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 