// Heatmap.jsx
// Responsibility: Shows historical congestion heatmap for a selected intersection
import React from 'react';
import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import './Heatmap.css';

// buildGrid(data) - transforms flat array into 7x96 grid
function buildGrid(data) {
  const grid = Array.from({ length: 7 }, () => Array(96).fill(null));
  data.forEach(row => {
    const date = new Date(row.time_slot);
    const utcHours = date.getUTCHours();
    const utcMinutes = date.getUTCMinutes();
    const localHours = (utcHours - 7 + 24) % 24;
    const slotIndex = localHours * 4 + Math.floor(utcMinutes / 15);
    const dayIndex = row.day_of_week;
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Heatmap({ intersection }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const response = await fetch(`/api/history?intersection=${encodeURIComponent(intersection)}`);
      const data = await response.json();
      setHistoryData(data);
      setLoading(false);
    }
    fetchHistory();
  }, [intersection]);

  const grid = buildGrid(historyData);

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">{intersection}</h3>
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <>
          {/* Time labels row */}
          <div className="heatmap-time-row">
            <span className="heatmap-day-label" />
            <div className="heatmap-time-labels">
              <span className="heatmap-time-label" style={{ left: '0%' }}>12am</span>
              <span className="heatmap-time-label" style={{ left: '4.2%' }}>1</span>
              <span className="heatmap-time-label" style={{ left: '8.4%' }}>2</span>
              <span className="heatmap-time-label" style={{ left: '12.6%' }}>3</span>
              <span className="heatmap-time-label" style={{ left: '16.8%' }}>4</span>
              <span className="heatmap-time-label" style={{ left: '21%' }}>5</span>
              <span className="heatmap-time-label" style={{ left: '25%' }}>6</span>
              <span className="heatmap-time-label" style={{ left: '29.2%' }}>7</span>
              <span className="heatmap-time-label" style={{ left: '33.4%' }}>8</span>
              <span className="heatmap-time-label" style={{ left: '37.6%' }}>9</span>
              <span className="heatmap-time-label" style={{ left: '41.8%' }}>10</span>
              <span className="heatmap-time-label" style={{ left: '46%' }}>11</span>
              <span className="heatmap-time-label" style={{ left: '50%' }}>12pm</span>
              <span className="heatmap-time-label" style={{ left: '54.2%' }}>1</span>
              <span className="heatmap-time-label" style={{ left: '58.4%' }}>2</span>
              <span className="heatmap-time-label" style={{ left: '62.6%' }}>3</span>
              <span className="heatmap-time-label" style={{ left: '66.8%' }}>4</span>
              <span className="heatmap-time-label" style={{ left: '71%' }}>5</span>
              <span className="heatmap-time-label" style={{ left: '75%' }}>6</span>
              <span className="heatmap-time-label" style={{ left: '79.2%' }}>7</span>
              <span className="heatmap-time-label" style={{ left: '83.4%' }}>8</span>
              <span className="heatmap-time-label" style={{ left: '87.6%' }}>9</span>
              <span className="heatmap-time-label" style={{ left: '91.8%' }}>10</span>
              <span className="heatmap-time-label" style={{ left: '95%' }}>11</span>
            </div>
          </div>

          {/* Grid rows */}
          <div className="heatmap-grid">
            {grid.map((daySlots, dayIndex) => (
              <div key={dayIndex} className="heatmap-row">
                <span className="heatmap-day-label">{DAYS[dayIndex]}</span>
                <div className="heatmap-cells-wrapper">
                  {daySlots.map((slot, slotIndex) => (
                    // React.Fragment lets us return two siblings (cell + gap) per iteration
                    <React.Fragment key={slotIndex}>
                      <div
                        className="heatmap-cell"
                        style={{
                          backgroundColor: slot ? getHeatmapColor(slot.avg_congestion) : '#e0e0e0'
                        }}
                        title={slot ? `${slot.avg_congestion.toFixed(2)} (${slot.sample_count} samples)` : 'No data'}
                      />
                      {/* insert a gap after every 4 slots (every hour) */}
                      {(slotIndex + 1) % 4 === 0 && <div className="heatmap-hour-gap" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Heatmap;