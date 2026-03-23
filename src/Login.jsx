import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // REGISTER USER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8084/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: "USER"
        })
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      alert("User Registered Successfully ✅");
      setIsNewUser(false);
      setFormData({ username: "", password: "" });

    } catch (err) {
      setError("Registration failed!");
    }
  };

  // LOGIN USER
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8084/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      navigate("/home");

    } catch (err) {
      setError("Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="toggle-buttons">
          <button onClick={() => setIsNewUser(false)}>Existing User</button>
          <button onClick={() => setIsNewUser(true)}>New User</button>
        </div>

        <h2>{isNewUser ? "Register" : "Login"}</h2>

        <form onSubmit={isNewUser ? handleRegister : handleLogin}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isNewUser ? "Register" : "Login"}
          </button>

        </form>

        {error && <p className="error">{error}</p>}

      </div>
    </div>
  );
}