// src/Login.jsx
import React, { useState } from 'react';

const Login = ({ setToken, setCurrentPage }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        // Save the token and navigate to the stats page
        setToken(data.access_token);
        setCurrentPage('stats');
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <div className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <button className="btn btn-primary w-full" onClick={onLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
