import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Cart from "./Cart";
import PaymentSuccess from "./PaymentSuccess";

function App() {

  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({ id: 1, name: "John Doe", valid: true });

  return (
    <BrowserRouter>

      <div style={{ width: "100%", minHeight: "100vh" }}>

        <Routes>

          <Route path="/" element={<Login setUser={setUser} />} />

          <Route
            path="/home"
            element={
              <Home
                cartItems={cartItems}
                setCartItems={setCartItems}
                user={user}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                setCartItems={setCartItems}
                user={user}
              />
            }
          />

          <Route
            path="/payment-success"
            element={<PaymentSuccess />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;