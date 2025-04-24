// src/pages/Login.js
import React, { useState } from "react";
import axios from "../api/axios";  // Assuming axios instance is set up correctly
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [user, setUser] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/local", {
        identifier: user.identifier,
        password: user.password,
      });

      const jwt = res.data.jwt;
      localStorage.setItem("token", jwt);
      setToken(jwt);
      alert("Login successful!");
      navigate("/"); // Redirect to Dashboard
    } catch (err) {
      alert("Login failed! Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <form onSubmit={handleLogin} style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="identifier"
            placeholder="Email"
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Don't have an account? <a href="/register" style={{ color: '#007bff' }}>Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
