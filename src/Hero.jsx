// src/Hero.jsx
import React from 'react';

const Hero = ({ onGetStarted }) => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-5xl font-bold">Elevate Your Game</h1>
          <p className="py-2">
            Track, analyze, and dominate every hand with our easy-to-use poker tracker. Your winning edge is just a click away.
          </p>
          <p className="py-2">
            Plus, unlock advanced analytics, saved notes, and AI coaching to take your play to the next level!
          </p>
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
