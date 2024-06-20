import React, { useState } from "react";
import Card from "./Card";
import "./App.css";

function App() {
  const [clientSecret, setClientSecret] = useState("");
  const createPaymentIntent = async () => {
    const response = await fetch("http://localhost:4000/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 5000 }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("response", response);
      // const { clientSecret } = await response.json();
      // setClientSecret(data.clientSecret);
      setClientSecret(data.clientSecret);
      console.log("client secret", data.clientSecret);
    } else {
      console.error("Error creating payment intent:", response.statusText);
    }
  };
  return (
    <>
      <div className="App">
        <h1>Stripe Payment Testing</h1>
        <button onClick={createPaymentIntent}>Initialize Payment</button>
        {clientSecret && <Card clientSecret={clientSecret} />}
      </div>
    </>
  );
}

export default App;
