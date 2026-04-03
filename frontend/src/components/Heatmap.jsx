// Heatmap.jsx
// Responsibility: Shows historical congestion heatmap for a selected intersection

// imports needed:
import { useState, useEffect } from 'react';
import chroma from 'chroma-js';

// helper functions needed:

// buildGrid(data) - transforms flat array into 7x96 grid
function buildGrid(data) {
  // Create 7 days × 96 time slots filled with null
  const grid = Array.from({ length: 7 }, () => Array(96).fill(null));

  // loop through each row from the API response
  data.forEach(row => {
    const date = new Date(row.time_slot);
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    // Convert UTC to Tucson time (UTC-7)
    const localHours = (utcHours - 7 + 24) % 24;
    // Calculate slot index (0-95) based on local hour and minute
    const slotIndex = localHours * 4 + Math.floor(utcMinutes / 15);
    // day_of_week from the database (0=Sunday, 6=Saturday)
    const dayIndex = row.day_of_week;

    // place the congestion data at the correct grid position
    grid[dayIndex][slotIndex] = {
      avg_congestion: row.avg_congestion,
      sample_count: row.sample_count
    };
  });

  return grid;
}

// getHeatmapColor(congestion_score) - returns color using chroma
// light blue (#add8e6) = free flow (score 1.0)
// hot pink (#ff69b4) = standstill (score 0.0)
function getHeatmapColor(congestion_score) {
  const scale = chroma.scale(['#ff69b4', '#add8e6']);
  return scale(congestion_score).hex();
}

// component:
function Heatmap({ intersection }) {
  // state for history data
  const [historyData, setHistoryData] = useState([]);
  // state for loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch from /api/history?intersection=name
    async function fetchHistory() {
      const response = await fetch(`/api/history?intersection=${encodeURIComponent(intersection)}`);
      const data = await response.json();
      // store result in state
      setHistoryData(data);
      setLoading(false);
    }
    fetchHistory();
  }, [intersection]); // re-runs when intersection changes

  // build the grid from the fetched data
  const grid = buildGrid(historyData);
  console.log("Grid built:", grid);

  return (
    <div>
      <p>Heatmap for {intersection}</p>
    </div>
  );
}

export default Heatmap;