// src/App.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from './Hero';
import StatsPage from './StatsPage';
import './App.css';

function App() {
  const [showHero, setShowHero] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {showHero ? (
          <Hero onGetStarted={() => setShowHero(false)} />
        ) : (
          <StatsPage />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
