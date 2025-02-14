// src/StatsPage.jsx
import React, { useState, useEffect } from 'react';
import './index.css';

const LOCAL_STORAGE_KEY = 'pokerGames';

const StatsPage = () => {
  // Initialize games state from localStorage using a lazy initializer.
  const [games, setGames] = useState(() => {
    const savedGames = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedGames ? JSON.parse(savedGames) : [];
  });

  // Form state for adding a new game
  const [formData, setFormData] = useState({
    gameName: '',
    buyIn: '',
    cashOut: '',
    stakes: ''
  });

  // State for controlling the details modal
  const [selectedGame, setSelectedGame] = useState(null);
  // Form state for updating extra details
  const [detailsFormData, setDetailsFormData] = useState({
    memorableHands: '',
    playerNotes: ''
  });

  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));
  }, [games]);

  // Handler for changes in the add-game form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for adding a new game
  const handleAddGame = (e) => {
    e.preventDefault();
    const { gameName, buyIn, cashOut, stakes } = formData;
    const newGame = {
      id: Date.now(), // Using timestamp as a unique id
      gameName,
      buyIn: parseFloat(buyIn),
      cashOut: parseFloat(cashOut),
      stakes,
      gainLoss: parseFloat(cashOut) - parseFloat(buyIn),
      memorableHands: '',
      playerNotes: ''
    };
    setGames(prev => [...prev, newGame]);
    // Clear the form after adding the game
    setFormData({
      gameName: '',
      buyIn: '',
      cashOut: '',
      stakes: ''
    });
  };

  // Clear all data (and localStorage) handler
  const handleClearData = () => {
    setGames([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const modal = document.getElementById('clearModal');
    if (modal) modal.close();
  };

  // Open the details modal for a specific game and pre-populate details
  const openGameDetailsModal = (game) => {
    setSelectedGame(game);
    setDetailsFormData({
      memorableHands: game.memorableHands || '',
      playerNotes: game.playerNotes || ''
    });
  };

  // Close (discard changes) the details modal
  const closeGameDetailsModal = () => {
    setSelectedGame(null);
  };

  // Handle changes in the details form (memorable hands and player notes)
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetailsFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save updated details and update the game in state
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    const updatedGame = { ...selectedGame, ...detailsFormData };
    setGames(prev =>
      prev.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
    closeGameDetailsModal();
  };

  // Calculate average profit/loss per game
  const averageProfitLoss = games.length > 0
    ? games.reduce((total, game) => total + game.gainLoss, 0) / games.length
    : 0;

// Calculate average buy in per game
  const averageBuyIn = games.length > 0
  ? games.reduce((total, game) => total + game.buyIn, 0) / games.length
  : 0;

  // Calculate average cash out per game
  const averageCashOut = games.length > 0
    ? games.reduce((total, game) => total + game.cashOut, 0) / games.length
    : 0;

  return (
    <div>
        <div className="mockup-browser bg-base-300 max-w-5xl mx-auto my-20 rounded-box shadow-2xl p-4">
        <div className="mockup-browser-toolbar">
          <div className="input">https://bankrollbuddy.com</div>
        </div>
        {/* MAIN CONTENT */}
        <main className="flex-grow container mx-auto p-4 bg-base-200 ">
            {/* Form for adding a new game */}
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
                    onClick={() => document.getElementById('clearModal').showModal()}
                    >
                    Clear Data
                </button>
                </div>
                {/* CLEAR DATA MODAL */}
                <dialog id="clearModal" className="modal modal-bottom sm:modal-middle">
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
                        onClick={() => document.getElementById('clearModal').close()}
                        >
                        No, cancel
                    </button>
                    </div>
                </div>
                </dialog>
            </div>
            </form>

            {/* Table displaying all games */}
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
                    <td>   
                        <div className="indicator">
                            <span>{game.gameName}</span>
                            {(game.memorableHands?.trim() || game.playerNotes?.trim()) && (
                            <span className="indicator-item ">
                                <span className="relative flex w-3 h-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                                </span>
                            </span>
                            )}
                        </div>
                    </td>

                    <td>${game.buyIn.toFixed(2)}</td>
                    <td>${game.cashOut.toFixed(2)}</td>
                    <td>{game.stakes}</td>
                    <td className={game.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {game.gainLoss.toFixed(2)}$
                    </td>
                    </tr>
                ))}
                </tbody>
                
            </table>
            </div>
                
            
        </main>

        {/* Game Details Modal */}
        {selectedGame && (
            <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Game Details: {selectedGame.gameName}</h3>
                {/* Display static game info */}
                <div className="mt-4 space-y-2">
                <div><strong>Buy In:</strong> ${selectedGame.buyIn.toFixed(2)}</div>
                <div><strong>Cash Out:</strong> ${selectedGame.cashOut.toFixed(2)}</div>
                <div><strong>Stakes:</strong> {selectedGame.stakes}</div>
                <div>
                    <strong>Gain/Loss:</strong>{' '}
                    <span className={selectedGame.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${selectedGame.gainLoss.toFixed(2)}
                    </span>
                </div>
                </div>
                {/* Form for updating extra details */}
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
                    <button type="button " className="btn" onClick={closeGameDetailsModal}>
                    Discard
                    </button>
                    <button type="submit transition-all transition-discrete" className="btn btn-primary">
                    Save Details
                    </button>
                </div>
                </form>
            </div>
            {/* Clicking on the backdrop closes the modal */}
            <div className="modal-backdrop" onClick={closeGameDetailsModal}></div>
            </div>
        )}
        </div>
        <div>
            {/* Statistics Section */}
            <div className="flex justify-center mt-6">
            <div className="stats shadow">

                <div className="stat place-items-center">
                    <div className="stat-title">Buy In</div>
                    <div className="stat-value">
                        <p>{games.reduce((total, game) => total + game.buyIn, 0).toFixed(2)}$</p>
                    </div>
                    <div className="stat-desc">
                        <p className={averageBuyIn >= 0 }>
                        {averageBuyIn.toFixed(2)} / game
                        </p>
                    </div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-title">Cash Out</div>
                    <div className="stat-value">
                        <p>{games.reduce((total, game) => total + game.cashOut, 0).toFixed(2)}$</p>
                    </div>
                    <div className="stat-desc">
                        <p className={averageCashOut }>
                        {averageCashOut.toFixed(2)} / game
                        </p>
                    </div>
                </div>
                

                <div className="stat place-items-center">
                    <div className="stat-title">TOTAL</div>
                        <div className="stat-value">
                            <p className={games.reduce((total, game) => total + game.gainLoss, 0) >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {games.reduce((total, game) => total + game.gainLoss, 0).toFixed(2)}$
                            </p>
                        </div>
                    <div className="stat-desc">
                    <p className={averageProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {averageProfitLoss.toFixed(2)} / game
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
    </div>
  );
};

export default StatsPage;
