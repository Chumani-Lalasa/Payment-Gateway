import React from 'react'
import { createRoot } from 'react-dom/client';
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const stripePromise = loadStripe('pk_test_51PTJnb05BCKRvDvFRQIsOzBFEWmGvy8IQ65aFyHca7FfBIHTDJ1k5M0W68MMSCHWkxx6janw8AQplgkzx8iGaHQf00ETYFfUai')
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>
)


