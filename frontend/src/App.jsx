// imports
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';



function getCongestionColor(congestion_score) {
  if (congestion_score < 0.5) return 'red';
  else if (congestion_score < 0.7) return 'yellow';
  else return 'green';
}

function App() {
  // state for traffic data
  const [trafficData, setTrafficData] = useState([]);
  // state for loading
  const [loading, setLoading] = useState(true);
  // state of hamburger menu
  const [isListOpen, setIsListOpen] = useState(false);

  
  useEffect(() => {
    async function fetchTraffic(){
      // fetch from /api/traffic
      const response = await fetch('/api/traffic');
      const data = await response.json();
      // store result in state
      setTrafficData(data);
      setLoading(false);
    }

    fetchTraffic();
  }, []);

return (
  <div className="app-container">
    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        {/* Info Panel */}
        <div className="intersection-menu">
          <h3 className="menu-title">Tucson Intersections
            <button className="toggle-button" onClick={() => setIsListOpen(!isListOpen)}>
              {isListOpen ? '✕' : '☰'}
            </button>
          </h3>
        {isListOpen ? //if hamburger is open, then show this below:
          trafficData.map((item) => (
            <div 
              key={item.intersection}
              className='intersection-list'
            >
              <div
                className='list-indicator' 
                style={{ background: getCongestionColor(item.congestion_score) }}  
              />
              <span className='list-item'>{item.intersection}</span>
            </div>
          ))
          : null //display nothing if hamburger is not open
        }
        </div>

        <MapContainer
          center={[32.2541, -110.9742]}
          zoom={11}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {trafficData.map((intersection) => (
            <Circle
              key={intersection.intersection}
              center={[intersection.lat, intersection.lng]}
              radius={800}
              pathOptions={{
                color: getCongestionColor(intersection.congestion_score),
                fillColor: getCongestionColor(intersection.congestion_score),
                fillOpacity: 0.5,
              }}
            >
              <Popup>
                <b>{intersection.intersection}</b><br />
                Congestion: {intersection.congestion_score}<br />
                Current Speed: {Math.round(intersection.current_speed * 0.621371)} mph<br />
                Free Flow: {Math.round(intersection.free_flow_speed * 0.621371)} mph
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </>
    )}
  </div>
);

}

export default App;