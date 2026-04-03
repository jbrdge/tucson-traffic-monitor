// Heatmap.jsx
// Responsibility: Shows historical congestion heatmap for a selected intersection

import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import './Heatmap.css';

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

// day labels for the heatmap rows
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Heatmap({ intersection }) {
  // state for history data
  const [historyData, setHistoryData] = useState([]);
  // state for loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      // fetch from /api/history?intersection=name
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

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">{intersection}</h3>
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <div className="heatmap-grid">
          {/* grid is a 7-element array (one per day).
              .map() loops through each day, giving us:
              - daySlots: the array of 96 time slots for that day
              - dayIndex: the position (0=Sunday, 1=Monday... 6=Saturday) */}
          {grid.map((daySlots, dayIndex) => (
            <div key={dayIndex} className="heatmap-row">
              {/* DAYS[dayIndex] converts the number into a readable day label */}
              <span className="heatmap-day-label">{DAYS[dayIndex]}</span>
              {/* loop through the 96 slots for this day */}
              {daySlots.map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="heatmap-cell"
                  style={{
                    // color by congestion score or grey if no data
                    backgroundColor: slot ? getHeatmapColor(slot.avg_congestion) : '#e0e0e0'
                  }}
                  // tooltip on hover showing raw values
                  title={slot ? `${slot.avg_congestion.toFixed(2)} (${slot.sample_count} samples)` : 'No data'}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Heatmap;