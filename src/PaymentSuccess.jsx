import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Card, CardContent, CardMedia, Box, Button } from "@mui/material";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if state exists
  if (!location.state) {
    return (
      <div style={{ padding: "20px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          No purchase found. Please go back to the store.
        </Typography>
        <Box textAlign="center">
          <Button variant="contained" onClick={() => navigate("/home")}>
            Back to Store
          </Button>
        </Box>
      </div>
    );
  }

  const purchasedItems = location.state.items;
  const totalBill = location.state.total;

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Thank You for Your Purchase! 🎉
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Your bill summary:
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {purchasedItems.map((item) => (
          <Card key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 1 }}>
            <CardMedia
              component="img"
              image={item.image}
              alt={item.name}
              sx={{ width: 100, height: 100, objectFit: 'contain' }}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="subtitle1" color="primary">
                Price: {item.price} × Quantity: {item.quantity || 1}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h6" align="center" marginTop={3}>
        Total Paid: ${totalBill.toFixed(2)}
      </Typography>

      <Box textAlign="center" marginTop={3}>
        <Button variant="contained" onClick={() => navigate("/home")}>
          Back to Store
        </Button>
      </Box>
    </div>
  );
}