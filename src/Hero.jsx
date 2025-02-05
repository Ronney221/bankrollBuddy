// src/Hero.jsx
import React from 'react';

const Hero = ({ onGetStarted }) => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-5xl font-bold">Yo, what's up?</h1>
          <p className="py-2">
            Ready to flex your poker stats like a boss?
          </p>
          <p className="py-2">
          Whether you're about that savage win or just tryna know where you went wrong, we've got you.
          </p>
          <p>
            Get in, get started, and let’s yeet those numbers into the stratosphere!
          </p>
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
