// src/AddGame.jsx
import React, { useState } from 'react';

const AddGame = ({ token }) => {
  const [gameData, setGameData] = useState({
    game_name: '',
    buy_in: 0,
    cash_out: 0,
    player_notes: '',
    game_notes: ''
  });

  const handleChange = (e) => {
    setGameData({ ...gameData, [e.target.name]: e.target.value });
  };

  const onAddGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Include the token here
        },
        body: JSON.stringify(gameData)
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Game added:", data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  return (
    <div>
      <h2>Add Game</h2>
      <input name="game_name" placeholder="Game Name" onChange={handleChange} />
      <input name="buy_in" type="number" placeholder="Buy In" onChange={handleChange} />
      <input name="cash_out" type="number" placeholder="Cash Out" onChange={handleChange} />
      <textarea name="player_notes" placeholder="Player Notes" onChange={handleChange}></textarea>
      <textarea name="game_notes" placeholder="Game Notes" onChange={handleChange}></textarea>
      <button onClick={onAddGame}>Save Game</button>
    </div>
  );
};

export default AddGame;
