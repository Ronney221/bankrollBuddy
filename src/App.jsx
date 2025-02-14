// src/App.jsx
import { Analytics } from "@vercel/analytics/react"
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from './Hero';
import StatsPage from './StatsPage';
import Notes from './Notes';
import Graph from './Graph';
import Advice from './Advice';
import Game from './Game';
import './App.css';

function App() {
  // Lazy initializer reads the current page from localStorage, default to "home"
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home';
  });

  // Save currentPage to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  let content;
  switch (currentPage) {
    case "home":
      content = <Hero onGetStarted={() => setCurrentPage("stats")} />;
      break;
    case "stats":
      content = <StatsPage />;
      break;
    case "notes":
      content = <Notes />;
      break;
    case "graph":
      content = <Graph />;
      break;
    case "advice":
      content = <Advice />;
      break;
    case "game": 
      content = <Game />;
      break;
    default:
      content = <Hero onGetStarted={() => setCurrentPage("stats")} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {content}

        <Analytics />
      </main>
      <Footer />
    </div>
  );
}

export default App;
