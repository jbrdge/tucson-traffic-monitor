// imports
import { useState, useEffect } from 'react';

function App() {

  // state for traffic data
  const [trafficData, setTrafficData] = useState([]);
  // state for loading
  const [loading, setLoading] = useState(true);
  
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
    <div>
      {/* map goes here */}
      <h1>Tucson Traffic Monitor App</h1>
      <p>Coming soon...</p>
    </div>
  )
}

export default App;