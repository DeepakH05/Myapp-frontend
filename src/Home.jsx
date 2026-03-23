import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const addToCart = async (product) => {

    if (!user || !user.valid) {
      alert("Only valid users can add to cart");
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8082/api/cart/add/${product.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl,
            quantity: 1
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      navigate("/cart");

    } catch (error) {
      console.error("Cart error:", error);
      alert("Error adding to cart");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading products...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>

      <h1 style={{ textAlign: "center" }}>
        Product Store
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px"
        }}
      >

        {products.map((product) => (

          <div
            key={product.id}
            style={{
              width: "220px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >

            <img
              src={product.imageUrl || "https://via.placeholder.com/150"}
              alt={product.name}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "contain"
              }}
            />

            <h3 style={{ margin: "10px 0" }}>
              {product.name}
            </h3>

            <p style={{ fontWeight: "bold" }}>
              ${product.price}
            </p>

            <button
              onClick={() => addToCart(product)}
              style={{
                padding: "8px 12px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Add To Cart
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}