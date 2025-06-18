import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axiosInstance from '../api/axiosInstance';
import './PaymentForm.css';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51RaP3WCD9xMkAzgO04GJu6AgspzsaqCIIU0DUNEFf5VkVeFjOEM0foJgKeCFCr9FmA6CzLFhG48pxFiMMWIoq6px00GLX0X8vM');

const PaymentForm = ({ amount, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert amount to cents (multiply by 100)
        const amountInCents = Math.round(amount * 100);
        console.log('Original amount:', amount);
        console.log('Amount in cents:', amountInCents);

        const response = await fetch('http://localhost:6969/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amountInCents }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        console.log('Payment intent created:', data);
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError(err.message);
        onError?.(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, onError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-4">
        <p>Unable to initialize payment. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
};

const CheckoutForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      setProcessing(false);
      return;
    }

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        console.error('Payment error:', submitError);
        setError(submitError.message);
        onError?.(submitError.message);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('An unexpected error occurred. Please try again.');
      onError?.(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg">
        <PaymentElement />
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          backgroundColor: '#2563EB',
          color: 'white',
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          marginTop: '16px'
        }}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm; 