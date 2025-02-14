// src/Hero.jsx
import React, { useState } from 'react';

const Hero = ({ onGetStarted, userName, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(formData);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-5xl font-bold">Elevate Your Game</h1>
          <p className="py-2">
            {userName
              ? `Welcome, ${userName}!`
              : 'Track, analyze, and dominate every hand with our easy-to-use poker tracker. Your winning edge is just a click away.'}
          </p>
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <button className="btn btn-primary" onClick={handleGetStarted}>
            Get Started for Free
            
          </button>
          <p className="mt-4">
            Already have an account?{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setCurrentPage('login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
