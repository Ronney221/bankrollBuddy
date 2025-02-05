// src/Graph.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const Graph = () => {
  // Read the saved games from localStorage.
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

  // Compute max and min values and their indices.
  const maxValue = runningProfit.length ? Math.max(...runningProfit) : 0;
  const minValue = runningProfit.length ? Math.min(...runningProfit) : 0;
  const maxIndex = runningProfit.indexOf(maxValue);
  const minIndex = runningProfit.indexOf(minValue);

  // Create arrays for point colors and radii.
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
        // Use a scriptable backgroundColor to create a gradient fill
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            // This case happens on initial chart render, return null so that Chart.js can update later.
            return null;
          }
          // Create a gradient that fills from the top to the bottom of the chart area.
          let gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          const yScale = chart.scales.y;
          // Find the pixel position for y=0 on the chart.
          const zeroPos = yScale.getPixelForValue(0);
          // Determine the ratio for the zero position.
          const ratio = (zeroPos - chartArea.top) / (chartArea.bottom - chartArea.top);
          // Fill above zero with green and below zero with red.
          gradient.addColorStop(0, 'rgba(75,192,192,0.5)');  // Top: green
          gradient.addColorStop(ratio, 'rgba(75,192,192,0.5)'); // Up to zero remains green
          gradient.addColorStop(ratio, 'rgba(255,99,132,0.5)');  // Start red at zero
          gradient.addColorStop(1, 'rgba(255,99,132,0.5)');      // Bottom: red
          return gradient;
        },
        tension: 0.4, // smooth curves
        pointBackgroundColor: pointBackgroundColors,
        pointRadius: pointRadii,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Running Profit/Loss After Each Game',
      },
      // Annotation: Draw a horizontal line at y=0.
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
        beginAtZero: false, // Allow negative values
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };
  
  return (
    <div className="mockup-browser bg-base-300 max-w-5xl mx-auto my-20 rounded-box shadow-2xl p-4">
      <div className="mockup-browser-toolbar">
        <div className="input">https://graph.com</div>
      </div>
      <div className="bg-base-200 flex justify-center px-4 py-16">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Graph;
