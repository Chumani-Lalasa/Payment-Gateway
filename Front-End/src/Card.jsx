import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import './index.css'

function Card({clientSecret}) {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        if(stripe){
            const pr = stripe.paymentRequest({
                country: 'IN',
                currency: 'inr',
                total: {
                    label: 'Total',
                    amount: 5000,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });
            pr.canMakePayment().then((result) => {
                if(result){
                    setPaymentRequest(pr);
                }
            });
            pr.on('paymentmethod', async (ev) => {
                try{
                    const {error} = await stripe.confirmCardPayment(
                        clientSecret,
                        {
                            payment_method: ev.paymentMethod.id,
                        },
                        {handleActions: false}
                    );
                    if(error){
                        console.error('Error confirming card payment:', error);
                        ev.complete('fail');
                        setPaymentStatus(`Payment failed: ${error.message}` );
                    }else{
                        ev.complete('success');
                        setPaymentStatus('Payment succeeded!');
                    }
                }catch(error){
                    console.error('Error confirming card payment:', error);
                    ev.complete('fail');
                    setPaymentStatus(`Payment failed: ${error.message}`)
                }
                
            });
        }
    },[clientSecret, stripe]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!stripe || !elements){
            return;
        }
        const cardElement = elements.getElement(CardElement);

        const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        })

        if(error){
            setPaymentStatus(`Payment failed: ${error.message}`);
        }else if(paymentIntent.status === 'succeeded'){
            setPaymentStatus('Payment succeeded!');
        }
    }
  return (
    <div>
      <form onSubmit={handleSubmit} className='payment-form'>
        <CardElement className='card-element' />
        <button type='submit' disabled={!stripe} className='pay-button'>
            Pay with Card
        </button>
        <div className='payment-status'>{paymentStatus}</div>
      </form>
      {paymentRequest && (
        <div>
            <PaymentRequestButtonElement options={{paymentRequest}}/>
        </div>
      )}
    </div>
  );
}

export default Card;
