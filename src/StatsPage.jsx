// src/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import PokerStatTracker from './PokerStatTracker';
import './index.css';

const LOCAL_STORAGE_KEY = 'pokerGames';

const StatsPage = () => {
  const [tracker] = useState(new PokerStatTracker());
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    gameName: '',
    buyIn: '',
    cashOut: '',
    stakes: ''
  });

  // State for the game details modal
  const [selectedGame, setSelectedGame] = useState(null);
  const [detailsFormData, setDetailsFormData] = useState({
    memorableHands: '',
    opponents: '',
    playerNotes: ''
  });

  // Load games from localStorage on initial mount
  useEffect(() => {
    const savedGames = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedGames) {
      try {
        const parsedGames = JSON.parse(savedGames);
        tracker.clearGames();
        parsedGames.forEach((game) => {
          tracker.addGame(game.gameName, game.buyIn, game.cashOut, game.stakes);
          // If extra details were saved, add them to the game object.
          // (Assuming your tracker stores the games as plain objects.)
          const storedGame = tracker.getGames().find((g) => g.id === game.id);
          if (storedGame) {
            storedGame.memorableHands = game.memorableHands;
            storedGame.opponents = game.opponents;
            storedGame.playerNotes = game.playerNotes;
          }
        });
        setGames(tracker.getGames());
      } catch (error) {
        console.error("Failed to load saved games:", error);
      }
    }
  }, [tracker]);

  // Save games to localStorage whenever games state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tracker.getGames()));
  }, [games, tracker]);

  // Handlers for adding a new game
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGame = (e) => {
    e.preventDefault();
    const { gameName, buyIn, cashOut, stakes } = formData;
    tracker.addGame(gameName, parseFloat(buyIn), parseFloat(cashOut), stakes);
    setGames(tracker.getGames());
    setFormData({
      gameName: '',
      buyIn: '',
      cashOut: '',
      stakes: ''
    });
  };

  const handleClearData = () => {
    tracker.clearGames();
    setGames(tracker.getGames());
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const modal = document.getElementById('clearModal');
    if (modal) modal.close();
  };

  // Handlers for the game details modal

  // Open the modal and populate the details form with any saved values
  const openGameDetailsModal = (game) => {
    setSelectedGame(game);
    setDetailsFormData({
      memorableHands: game.memorableHands || '',
      opponents: game.opponents || '',
      playerNotes: game.playerNotes || ''
    });
  };

  // Close the modal
  const closeGameDetailsModal = () => {
    setSelectedGame(null);
  };

  // Update the form as the user types
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetailsFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the updated details back into the game state (and tracker)
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    // Create an updated game object by merging the extra details
    const updatedGame = { ...selectedGame, ...detailsFormData };

    // Update the games array state
    const updatedGames = games.map((game) =>
      game.id === updatedGame.id ? updatedGame : game
    );
    setGames(updatedGames);

    // (Optional) If your tracker has an update method, call it here.
    // For example: tracker.updateGame(updatedGame.id, updatedGame);

    closeGameDetailsModal();
  };

  // Calculate average profit/loss per game (if any games exist)
  const averageProfitLoss =
    games.length > 0
      ? games.reduce((total, game) => total + game.gainLoss, 0) / games.length
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN CONTENT */}
      <main className="flex-grow container mx-auto p-4">
        {/* Input Form & Add Game Button */}
        <form onSubmit={handleAddGame} className="mb-6">
          <div className="grid grid-cols-6 gap-5">
            <input
              type="text"
              name="gameName"
              value={formData.gameName}
              onChange={handleChange}
              placeholder="Game Name"
              className="input input-bordered w-full"
              required
            />
            <input
              type="number"
              name="buyIn"
              value={formData.buyIn}
              onChange={handleChange}
              placeholder="Buy In"
              className="input input-bordered w-full"
              required
            />
            <input
              type="number"
              name="cashOut"
              value={formData.cashOut}
              onChange={handleChange}
              placeholder="Cash Out"
              className="input input-bordered w-full"
              required
            />
            <input
              type="text"
              name="stakes"
              value={formData.stakes}
              onChange={handleChange}
              placeholder="Stakes (e.g., 1/2)"
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn btn-primary">
              Add Game
            </button>
            {/* CLEAR DATA BUTTON */}
            <div className="flex justify-start">
              <button
                type="button"
                className="btn btn-outline btn-error"
                onClick={() =>
                  document.getElementById('clearModal').showModal()
                }
              >
                Clear Data
              </button>
            </div>
            {/* CLEAR DATA MODAL */}
            <dialog
              id="clearModal"
              className="modal modal-bottom sm:modal-middle"
            >
              <div className="modal-box">
                <h3 className="font-bold text-lg">Warning</h3>
                <p className="py-4">
                  This will clear all your saved data. Are you sure?
                </p>
                <div className="modal-action">
                  <button className="btn" onClick={handleClearData}>
                    Yes, clear data
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() =>
                      document.getElementById('clearModal').close()
                    }
                  >
                    No, cancel
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </form>

        {/* DaisyUI Table Display */}
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Game Name</th>
                <th>Buy In</th>
                <th>Cash Out</th>
                <th>Stakes</th>
                <th>Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr
                  className="hover cursor-pointer"
                  key={game.id}
                  onClick={() => openGameDetailsModal(game)}
                >
                  <th>{index + 1}</th>
                  <td>{game.gameName}</td>
                  <td>${game.buyIn.toFixed(2)}</td>
                  <td>${game.cashOut.toFixed(2)}</td>
                  <td>{game.stakes}</td>
                  <td
                    className={
                      game.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    ${game.gainLoss.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {/* You can add footer content here if needed */}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Statistics Section */}
        <br />
        <br />
        <div className="flex justify-center mt-6">
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Buy In</div>
              <div className="stat-value">
                <p>
                  ${games.reduce((total, game) => total + game.buyIn, 0).toFixed(2)}
                </p>
              </div>
              <div className="stat-desc"></div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Cash Out</div>
              <div className="stat-value">
                <p>
                  ${games.reduce((total, game) => total + game.cashOut, 0).toFixed(2)}
                </p>
              </div>
              <div className="stat-desc"></div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">TOTAL</div>
              <div className="stat-value">
                <p
                  className={
                    games.reduce((total, game) => total + game.gainLoss, 0) >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  ${games.reduce((total, game) => total + game.gainLoss, 0).toFixed(2)}
                </p>
              </div>
              <div className="stat-desc">
                <p
                  className={
                    averageProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                  }
                >
                  ${averageProfitLoss.toFixed(2)} / game
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Game Details: {selectedGame.gameName}
            </h3>
            <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-4">
              <div>
                <label className="label">
                  <span className="label-text">Memorable Hands</span>
                </label>
                <textarea
                  name="memorableHands"
                  value={detailsFormData.memorableHands}
                  onChange={handleDetailsChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter memorable hands..."
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Opponents</span>
                </label>
                <textarea
                  name="opponents"
                  value={detailsFormData.opponents}
                  onChange={handleDetailsChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter opponent details..."
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Player Notes</span>
                </label>
                <textarea
                  name="playerNotes"
                  value={detailsFormData.playerNotes}
                  onChange={handleDetailsChange}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter player notes..."
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={closeGameDetailsModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Details
                </button>
              </div>
            </form>
          </div>
          {/* Optionally, clicking on the backdrop will close the modal */}
          <div className="modal-backdrop" onClick={closeGameDetailsModal}></div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
