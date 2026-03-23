import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, CardMedia, Box, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // ✅ initialize as array

  // Fetch cart items on mount
  useEffect(() => {
    fetch("http://localhost:8082/api/cart")
      .then(res => res.json())
      .then(data => {
        console.log("Cart API Data:", data);
        // Ensure we always have an array
        setCartItems(Array.isArray(data) ? data : data.items || []);
      })
      .catch(err => console.error("Error fetching cart:", err));
  }, []);

  // Increase quantity
  const increaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && (item.quantity || 1) > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove item
  // Remove item
const removeFromCart = async (id) => {
  try {
    const response = await fetch(`http://localhost:8082/api/cart/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to remove item");

    // Remove from frontend state after successful deletion
    setCartItems(prev => prev.filter(item => item.id !== id));
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Failed to remove item. Try again!");
  }
};

  // Total bill (safe)
  const totalBill = (cartItems || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  // Handle payment
  const handlePay = async () => {
  if (!cartItems.length) {
    alert("Your cart is empty!");
    return;
  }

  try {
    // 1️⃣ Send payment request to backend
    const response = await fetch("http://localhost:8083/api/payment/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId: 1,               // adjust if each cart item has a separate cart ID
        amount: totalBill,
        method: "Credit Card"     // or make this dynamic
      }),
    });

    if (!response.ok) throw new Error("Payment failed");

    const paymentResult = await response.json();
    console.log("Payment result:", paymentResult);

    // 2️⃣ Remove purchased items from backend cart
    for (const item of cartItems) {
      await fetch(`http://localhost:8082/api/cart/${item.id}`, {
        method: "DELETE",
      });
    }

    // 3️⃣ Clear local cart state
    setCartItems([]);

    // 4️⃣ Navigate to success page
    navigate("/payment-success", { state: { items: cartItems, total: totalBill } });

  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed. Try again!");
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Cart
      </Typography>

      {(!cartItems || cartItems.length === 0) ? (
        <Typography variant="h6" align="center">Your cart is empty</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {cartItems.map((product) => (
            <Card key={product.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 1 }}>
              <CardMedia
                component="img"
                image={product.image} // must match backend field
                alt={product.name}
                sx={{ width: 100, height: 100, objectFit: 'contain' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="subtitle1" color="primary">
                  ${product.price?.toFixed(2)}
                </Typography>

                {/* Quantity Controls */}
                <Box display="flex" alignItems="center" gap={1} marginTop={1}>
                  <IconButton size="small" onClick={() => decreaseQty(product.id)}>
                    <RemoveIcon fontSize="small"/>
                  </IconButton>
                  <Typography>{product.quantity || 1}</Typography>
                  <IconButton size="small" onClick={() => increaseQty(product.id)}>
                    <AddIcon fontSize="small"/>
                  </IconButton>
                </Box>
              </CardContent>
              <Box display="flex" flexDirection="column" gap={1} paddingRight={1}>
                <Button variant="contained" color="error" onClick={() => removeFromCart(product.id)}>
                  Remove
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Total bill + buttons */}
      {cartItems.length > 0 && (
        <Box textAlign="center" marginTop={3}>
          <Typography variant="h6" marginBottom={2}>
            Total: ${totalBill.toFixed(2)}
          </Typography>
          <Button variant="contained" onClick={() => navigate("/home")}>Back</Button>
          <Button
            variant="contained"
            color="success"
            sx={{ marginLeft: 2 }}
            onClick={handlePay}
          >
            Pay
          </Button>
        </Box>
      )}
    </div>
  );
}