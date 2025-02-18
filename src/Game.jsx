import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [showSettlements, setShowSettlements] = useState(false);
  const [saveGameName, setSaveGameName] = useState("");
  const [savedGames, setSavedGames] = useState([]);
  const [selectedSavedGame, setSelectedSavedGame] = useState("");

  // On mount, load saved games from local storage.
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedGames") || "[]");
    setSavedGames(saved);
  }, []);

  // Add a new player with an empty list of buy-ins and zero cash out.
  const addPlayer = () => {
    if (newPlayerName.trim() === "") {
      toast.error("Player name cannot be empty.");
      return;
    }
    const newPlayer = {
      id: Date.now(),
      name: newPlayerName,
      buyIns: [],
      cashOut: 0,
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
    toast.success("Player added!");
  };

  // Append a buy-in amount for a given player.
  const addBuyIn = (playerId, amount) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return { ...player, buyIns: [...player.buyIns, amount] };
      }
      return player;
    }));
    toast.success("Buy-In added!");
  };

  // Update a player's cash out value.
  const updateCashOut = (playerId, amount) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return { ...player, cashOut: amount };
      }
      return player;
    }));
    toast.success("Cash Out updated!");
  };

  // Calculate overall totals for the session.
  const totalBuyIn = players.reduce(
    (acc, player) => acc + player.buyIns.reduce((sum, b) => sum + b, 0),
    0
  );
  const totalCashOut = players.reduce(
    (acc, player) => acc + Number(player.cashOut),
    0
  );
  const totalGainLoss = players.reduce((acc, player) => {
    const totalBuy = player.buyIns.reduce((sum, b) => sum + b, 0);
    return acc + (Number(player.cashOut) - totalBuy);
  }, 0);

  // Settlement calculation: compute net for each player and match debtors/creditors.
  const calculateSettlements = () => {
    const netList = players.map(player => {
      const totalBuy = player.buyIns.reduce((sum, buy) => sum + buy, 0);
      const net = Number(player.cashOut) - totalBuy;
      return { id: player.id, name: player.name, net };
    });

    const creditors = netList
      .filter(player => player.net > 0)
      .sort((a, b) => b.net - a.net);
    const debtors = netList
      .filter(player => player.net < 0)
      .sort((a, b) => a.net - b.net);

    const settlementsResult = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];
      const settlementAmount = Math.min(creditor.net, -debtor.net);

      if (settlementAmount > 0) {
        settlementsResult.push({
          from: debtor.name,
          to: creditor.name,
          amount: settlementAmount.toFixed(2)
        });
        creditor.net -= settlementAmount;
        debtor.net += settlementAmount;
      }

      if (Math.abs(creditor.net) < 0.01) creditorIndex++;
      if (Math.abs(debtor.net) < 0.01) debtorIndex++;
    }

    setSettlements(settlementsResult);
    setShowSettlements(true);
    toast.success("Settlements calculated!");
  };

  // Save current game (players and game name) to local storage.
  const saveGame = () => {
    if (saveGameName.trim() === "") {
      toast.error("Please enter a name for the game.");
      return;
    }
    const gameState = {
      id: Date.now(),
      gameName: saveGameName,
      players,
      timestamp: new Date().toISOString(),
    };
    const currentGames = JSON.parse(localStorage.getItem("savedGames") || "[]");
    const newGames = [gameState, ...currentGames];
    localStorage.setItem("savedGames", JSON.stringify(newGames));
    setSavedGames(newGames);
    setSaveGameName("");
    toast.success("Game saved!");
  };

  // Load a saved game from the dropdown.
  const loadGame = () => {
    if (!selectedSavedGame) {
      toast.error("Please select a saved game.");
      return;
    }
    const gameToLoad = savedGames.find(game => game.id.toString() === selectedSavedGame);
    if (gameToLoad) {
      setPlayers(gameToLoad.players);
      toast.success(`Loaded game: ${gameToLoad.gameName}`);
    } else {
      toast.error("Saved game not found.");
    }
  };

  // Player card component displaying individual buy-ins.
  const PlayerCard = ({ player }) => {
    const [buyInInput, setBuyInInput] = useState("");
    const [cashOutInput, setCashOutInput] = useState("");
    const totalBuyIns = player.buyIns.reduce((sum, b) => sum + b, 0);
    const profitLoss = Number(player.cashOut) - totalBuyIns;

    return (
      <div className="card bg-white shadow-lg p-4 m-2">
        <h3 className="text-xl font-bold">{player.name}</h3>
        <p>
          Buy ins: {player.buyIns.length > 0 ? player.buyIns.join(', ') : 'None'}
        </p>
        <p>Total: {totalBuyIns.toFixed(2)}$</p>
        <p>Cash out: {Number(player.cashOut).toFixed(2)}$</p>
        <p>Profit/Loss: {profitLoss.toFixed(2)}$</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const amount = parseFloat(buyInInput);
            if (!isNaN(amount)) {
              addBuyIn(player.id, amount);
            }
            setBuyInInput("");
          }}
          className="mt-2 flex space-x-2"
        >
          <input
            type="number"
            value={buyInInput}
            onChange={(e) => setBuyInInput(e.target.value)}
            placeholder="Buy in amount"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary">
            Add Buy-In
          </button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const amount = parseFloat(cashOutInput);
            if (!isNaN(amount)) {
              updateCashOut(player.id, amount);
            }
            setCashOutInput("");
          }}
          className="mt-2 flex space-x-2"
        >
          <input
            type="number"
            value={cashOutInput}
            onChange={(e) => setCashOutInput(e.target.value)}
            placeholder="Cash out"
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-secondary">
            Cash Out
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full sm:max-w-3xl md:max-w-7xl mx-auto px-4">
      <div className="mockup-browser bg-base-300 max-w-5xl mx-auto my-20 rounded-box shadow-2xl">
        <div className="mockup-browser-toolbar">
          <div className="input">https://homegamecalculator.com</div>
        </div>
        <div className="bg-base-200 p-4">
          <h1 className="text-3xl font-bold mb-4">Home Game Calculator</h1>
          <div className="flex justify-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPlayer();
              }}
              className="flex flex-col sm:flex-row justify-center mt-4 gap-4"
            >
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player Name"
                className="input input-bordered w-70"
              />
              <button type="submit" className="btn btn-primary">
                Add Player
              </button>
            </form>
          </div>

          {/* Save Game Section */}
          <div className="flex flex-col sm:flex-row justify-center mt-4 gap-4">
            <input
              type="text"
              value={saveGameName}
              onChange={(e) => setSaveGameName(e.target.value)}
              placeholder="Enter game name"
              className="input input-bordered"
            />
            <button className="btn btn-accent" onClick={saveGame}>
              Save Game
            </button>
            
          </div>

          {/* Load Saved Game Section */}
          {savedGames.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-center mt-4 gap-4">
              <select
                className="select select-bordered w-full sm:max-w-xs"
                value={selectedSavedGame}
                onChange={(e) => setSelectedSavedGame(e.target.value)}
              >
                <option value="">Select a saved game</option>
                {savedGames.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.gameName} - {new Date(game.timestamp).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <button className="btn btn-outline" onClick={loadGame}>
                Load Saved Game
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {players.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

        
        </div>
      </div>
      <div>
        {/* Statistics Section */}
        <div className="flex justify-center mt-6">
          <div className="stats stats-vertical lg:stats-horizontal shadow">
            <div className="stat place-items-center">
              <div className="stat-title">total buy in</div>
              <div className="stat-value">
                <p>{totalBuyIn.toFixed(2)}$</p>
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">total cash out</div>
              <div className="stat-value">
                <p>{totalCashOut.toFixed(2)}$</p>
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">we are off by</div>
              <div className="stat-value">
                <p className={totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {totalGainLoss.toFixed(2)}$
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-4 gap-4">
          <button className="btn btn-outline btn-secondary" onClick={calculateSettlements}>
              Calculate Settlements
            </button>
            </div>

        {showSettlements && (
          <div className="card bg-base-100 shadow-lg mx-auto max-w-md mt-4">
            <div className="card-body">
              <h3 className="card-title text-center">Settlements</h3>
              <div className="space-y-2 mt-4">
                {settlements.map((settlement, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-base-200 text-base-content shadow"
                  >
                    {settlement.from} pays {settlement.to} {settlement.amount}$
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <br /><br /><br />
    </div>
  );
};

export default Game;
