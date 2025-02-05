// src/Notes.jsx
import React, { useState, useEffect } from 'react';
import './index.css';

const Notes = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const savedGames = localStorage.getItem('pokerGames');
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (error) {
        console.error('Failed to parse saved games in Notes:', error);
      }
    }
  }, []);

  // Filter out games that have either memorableHands or playerNotes (non-empty)
  const notesGames = games.filter(
    game =>
      (game.memorableHands && game.memorableHands.trim() !== "") ||
      (game.playerNotes && game.playerNotes.trim() !== "")
  );

  // Chat bubble classes that cycle through
  const bubbleClasses = [
    "chat-bubble chat-bubble-primary",
    "chat-bubble chat-bubble-secondary",
    "chat-bubble chat-bubble-accent",
    "chat-bubble chat-bubble-info",
    "chat-bubble chat-bubble-success",
    "chat-bubble chat-bubble-warning",
    "chat-bubble chat-bubble-error"
  ];

  // We'll use a counter to assign a color class to each bubble
  let bubbleIndex = 0;

  return (
    

    <div className="mockup-browser bg-base-300 max-w-5xl mx-auto my-20 rounded-box shadow-2xl p-6">
      <div className="mockup-browser-toolbar">
        <div className="input">https://notes.com</div>
      </div>
        <div className="bg-base-200 flex flex-col justify-center px-4 py-16 space-y-8">
        {/* Persistent Chat Bubble */}
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://i.ibb.co/9mpW9XRV/avatar.webp"
              />
            </div>
          </div>
          <div className="chat-header px-4">
            Ronney Do   
            <time className="text-xs opacity-50"> Software Engineer - OPEN TO OPPORTUNITIES</time>
          </div>
          <div className="chat-bubble">
            Click into one of your recent games and leave a note!
          </div>
          <div className="chat-footer px-2">
  <a 
    href="https://docs.google.com/document/d/1LrOxb1h5nHf0gbXTiCUulH64IVjJRTscKFopmrgyouE/edit?usp=sharing" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    Resume
  </a>
</div>
        </div>

        {/* Dynamic Chat Bubbles for Saved Notes */}
        {notesGames.length === 0 ? (
          <p className="text-center"></p>
        ) : (
          notesGames.map((game) => (
            <div key={game.id} className="space-y-4">
              {game.memorableHands && game.memorableHands.trim() !== "" && (
                <div className="chat chat-start">
                  <div className="chat-header px-4">{game.gameName}</div>
                  <div
                    className={
                      bubbleClasses[bubbleIndex++ % bubbleClasses.length] +
                      " whitespace-pre-line"
                    }
                  >
                    {game.memorableHands}
                  </div>
                  <div className="chat-footer opacity-50">
                    Memorable Hands
                  </div>
                </div>
              )}
              {game.playerNotes && game.playerNotes.trim() !== "" && (
                <div className="chat chat-end">
                  <div className="chat-header px-4">{game.gameName}</div>
                  <div
                    className={
                      bubbleClasses[bubbleIndex++ % bubbleClasses.length] +
                      " whitespace-pre-line"
                    }
                  >
                    {game.playerNotes}
                  </div>
                  <div className="chat-footer opacity-50">
                    Player Notes
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      </div>

   
  );
};

export default Notes;
