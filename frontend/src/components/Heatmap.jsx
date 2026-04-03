const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

            {/* DAYS[dayIndex] uses dayIndex as a lookup into the DAYS array.
                dayIndex=0 → DAYS[0] → 'Sun'
                dayIndex=1 → DAYS[1] → 'Mon'
                dayIndex=5 → DAYS[5] → 'Fri'
                This converts the number into a readable day label */}
            <span className="heatmap-day-label">{DAYS[dayIndex]}</span>

            {/* daySlots is the array of 96 slots for this day.
                .map() loops through each slot, giving us:
                - slot: either null (no data) or { avg_congestion, sample_count }
                - slotIndex: position 0-95 representing each 15-minute window */}
            {daySlots.map((slot, slotIndex) => (
              <div
                key={slotIndex}
                className="heatmap-cell"
                style={{
                  // if slot has data, color it by congestion score
                  // if slot is null (no data collected yet), use grey
                  backgroundColor: slot ? getHeatmapColor(slot.avg_congestion) : '#e0e0e0'
                }}
                // tooltip on hover showing the raw values
                title={slot ? `${slot.avg_congestion.toFixed(2)} (${slot.sample_count} samples)` : 'No data'}
              />
            ))}
          </div>
        ))}
      </div>
    )}
  </div>
);