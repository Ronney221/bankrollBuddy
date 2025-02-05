// src/PokerStatTracker.js

/**
 * Class representing a Poker Stat Tracker.
 *
 * Each game session includes:
 *  - id: string - Unique identifier for the session.
 *  - gameName: string - The name of the poker game.
 *  - buyIn: number - The buy-in amount.
 *  - cashOut: number - The cash-out amount.
 *  - stakes: string - The stakes in the form "small/big" (e.g., "1/2").
 *  - gainLoss: number - The difference (cashOut - buyIn) representing profit or loss.
 *
 * Provides methods to add, update, delete, and clear games,
 * as well as getters for aggregated totals.
 */
class PokerStatTracker {
    constructor() {
      this._games = [];
    }
  
    addGame(gameName, buyIn, cashOut, stakes) {
      const game = {
        id: this._generateId(),
        gameName,
        buyIn,
        cashOut,
        stakes,
        gainLoss: this._calculateGainLoss(buyIn, cashOut),
      };
      this._games.push(game);
    }
  
    updateGame(id, updatedData) {
      const index = this._games.findIndex(game => game.id === id);
      if (index === -1) throw new Error("Game session not found");
      const game = this._games[index];
      if (updatedData.gameName !== undefined) game.gameName = updatedData.gameName;
      if (updatedData.buyIn !== undefined) game.buyIn = updatedData.buyIn;
      if (updatedData.cashOut !== undefined) game.cashOut = updatedData.cashOut;
      if (updatedData.stakes !== undefined) game.stakes = updatedData.stakes;
      if (updatedData.buyIn !== undefined || updatedData.cashOut !== undefined) {
        game.gainLoss = this._calculateGainLoss(game.buyIn, game.cashOut);
      }
    }
  
    deleteGame(id) {
      this._games = this._games.filter(game => game.id !== id);
    }
  
    clearGames() {
      this._games = [];
    }
  
    getGames() {
      return [...this._games];
    }
  
    getTotalGainLoss() {
      return this._games.reduce((total, game) => total + game.gainLoss, 0);
    }
  
    getTotalGamesPlayed() {
      return this._games.length;
    }
  
    getTotalBuyIn() {
      return this._games.reduce((total, game) => total + game.buyIn, 0);
    }
  
    getTotalCashOut() {
      return this._games.reduce((total, game) => total + game.cashOut, 0);
    }
  
    _calculateGainLoss(buyIn, cashOut) {
      return cashOut - buyIn;
    }
  
    _generateId() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  }
  
  export default PokerStatTracker;
  