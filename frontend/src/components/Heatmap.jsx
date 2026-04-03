const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

return (
  <div className="heatmap-container">
    <h3 className="heatmap-title">{intersection}</h3>
    {loading ? (
      <p>Loading history...</p>
    ) : (
      <div className="heatmap-grid">
        {/* TODO: loop through the 7 days in the grid
            each iteration gives us the day's slots array and the day index */}
          {/* TODO: render a row for each day */}

              {/* TODO: use the day index to look up the day name from the DAYS array
                  and display it as a label on the left */}

              {/* TODO: loop through the 96 time slots for this day
                  each iteration gives us the slot data and the slot index */}

                  {/* TODO: render a cell for each time slot
                      if the slot has data, color it using getHeatmapColor
                      if the slot is null (no data yet), use grey
                      add a tooltip showing the raw congestion value and sample count */}
      </div>
    )}
  </div>
);