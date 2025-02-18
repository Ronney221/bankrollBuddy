// src/Graph.jsx
import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const Graph = () => {
  // Read saved games from localStorage.
  const [games, setGames] = useState([]);
  
  useEffect(() => {
    const savedGames = localStorage.getItem('pokerGames');
    if (savedGames) {
      try {
        setGames(JSON.parse(savedGames));
      } catch (error) {
        console.error('Failed to parse saved games in Graph:', error);
      }
    }
  }, []);
  
  // Compute the running total of profit/loss.
  const runningProfit = games.reduce((acc, game, index) => {
    const previousTotal = index === 0 ? 0 : acc[index - 1];
    acc.push(previousTotal + game.gainLoss);
    return acc;
  }, []);
  
  // Use game names as labels.
  const labels = games.map((game) => game.gameName);
  
  // Compute max and min values for graph annotations.
  const maxValue = runningProfit.length ? Math.max(...runningProfit) : 0;
  const minValue = runningProfit.length ? Math.min(...runningProfit) : 0;
  const maxIndex = runningProfit.indexOf(maxValue);
  const minIndex = runningProfit.indexOf(minValue);

  // Configure point styling.
  const pointBackgroundColors = runningProfit.map((value, index) => {
    if (index === maxIndex) return 'green';
    if (index === minIndex) return 'red';
    return 'rgba(75,192,192,1)';
  });
  const pointRadii = runningProfit.map((value, index) => {
    if (index === maxIndex || index === minIndex) return 8;
    return 4;
  });
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Running Profit/Loss',
        data: runningProfit,
        borderColor: 'rgba(75,192,192,1)',
        // Create a gradient fill that transitions based on zero.
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          let gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          const yScale = chart.scales.y;
          const zeroPos = yScale.getPixelForValue(0);
          const ratio = (zeroPos - chartArea.top) / (chartArea.bottom - chartArea.top);
          gradient.addColorStop(0, 'rgba(75,192,192,0.5)');
          gradient.addColorStop(ratio, 'rgba(75,192,192,0.5)');
          gradient.addColorStop(ratio, 'rgba(255,99,132,0.5)');
          gradient.addColorStop(1, 'rgba(255,99,132,0.5)');
          return gradient;
        },
        tension: 0.4,
        pointBackgroundColor: pointBackgroundColors,
        pointRadius: pointRadii,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Running Profit/Loss After Each Game',
      },
      // Annotation draws a horizontal line at y=0.
      annotation: {
        annotations: {
          zeroLine: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgba(255,0,0,0.8)',
            borderWidth: 2,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  // Additional Statistics Calculations
  const biggestWin = games.length ? Math.max(...games.map(game => game.gainLoss)) : 0;
  const biggestLoss = games.length ? Math.min(...games.map(game => game.gainLoss)) : 0;
  
  // Compute the longest win streak.
  let currentWinStreak = 0;
  let longestWinStreak = 0;
  games.forEach(game => {
    if (game.gainLoss > 0) {
      currentWinStreak++;
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    } else {
      currentWinStreak = 0;
    }
  });
  
  // Calculate win rate.
  const totalWins = games.filter(game => game.gainLoss > 0).length;
  const winRate = games.length ? (totalWins / games.length) * 100 : 0;

  // Data for a Bar Chart comparing biggest win and biggest loss.
  const barData = {
    labels: ['Biggest Win', 'Biggest Loss'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [biggestWin, Math.abs(biggestLoss)],
        backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
      }
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      // title: {
      //   display: true,
      //   text: '',
      // },
    },
  };

  return (
    <div>
      {/* Profit/Loss Line Chart */}
      <div className="w-full sm:max-w-3xl md:max-w-7xl mx-auto px-4">
      <div className="mockup-browser bg-base-300 max-w-5xl mx-auto my-20 rounded-box shadow-2xl">
        <div className="mockup-browser-toolbar">
          <div className="input">https://graph.com</div>
        </div>
        <div className="bg-base-200 flex justify-center px-4 py-16">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Key Statistics Section */}
      <div className="max-w-5xl mx-auto my-8 p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Key Statistics</h2>
        <div className="sstats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title flex justify-center">Biggest Win</div>
            <div className="stat-value text-green-500 flex justify-center">{biggestWin.toFixed(2)}$</div>
          </div>
          <div className="stat">
            <div className="stat-title flex justify-center">Biggest Loss</div>
            <div className="stat-value text-red-500 flex justify-center">{biggestLoss.toFixed(2)}$</div>
          </div>
          <div className="stat">
            <div className="stat-title flex justify-center">Longest Win Streak</div>
            <div className="stat-value flex justify-center">{longestWinStreak}</div>
          </div>
          <div className="stat">
            <div className="stat-title flex justify-center">Win Rate</div>
            <div className="stat-value flex justify-center">{winRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Biggest Win vs Biggest Loss Bar Chart */}
      <div className="max-w-5xl mx-auto my-8 p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Biggest Win vs Biggest Loss</h2>
        <div className="bg-base-200 p-4">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Graph;
