// collect.js
// Responsibility: Called by cron job every 15 minutes
// Fetches live traffic for all intersections and writes to Supabase

const TOMTOM_BASE_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json';
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

// The intersections we are tracking with their coordinates
const INTERSECTIONS = [
  { name: 'Speedway & Swan', lat: 32.2362, lng: -110.8926 },
  { name: 'Speedway & Mountain', lat: 32.2360, lng: -110.9524 },
  { name: '6th & Euclid', lat: 32.2278, lng: -110.9595 },
  { name: 'Campbell & River', lat: 32.2872, lng: -110.9438 },
  { name: 'Pima & Country Club', lat: 32.2432, lng: -110.9268 },
  { name: '22nd & Craycroft', lat: 32.2069, lng: -110.8751 },
  { name: '22nd & Park', lat: 32.2068, lng: -110.9562 },
  { name: 'Glenn & Swan', lat: 32.2582, lng: -110.8928 },
  { name: 'Oracle & Ina', lat: 32.3371, lng: -110.9774 },
  { name: 'Broadway & Pantano', lat: 32.2209, lng: -110.8238 },
  { name: 'Prince & Romero', lat: 32.2723, lng: -111.0034},
  { name: 'Grande & Congress', lat: 32.2201, lng: -110.9884},
  { name: 'Rita & Houghton', lat: 32.1027, lng: -110.7730 },
  { name: 'Valencia & Midvale Park', lat: 32.1338, lng: -110.9991 },
  { name: 'St. Marys & Silverbell', lat: 32.2289, lng: -110.9988},
  { name: 'Gates Pass & Camino De Oeste', lat: 32.2356, lng: -111.0627 },
  { name: 'Marana & Sandario', lat: 32.4606, lng: -111.2170 },
  { name: 'Sunrise & Sabino Canyon', lat: 32.3089, lng: -110.8241},
  { name: 'Sweetwater & Benan Venture', lat: 32.2799, lng: -111.01997},
  { name: 'Soldier Trail & Roger', lat: 32.2796, lng: -110.7381}
];

async function fetchTrafficData(intersection) {
  // fetches current speed and free flow speed from TOMTOM API  
  // fetch reference page: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

  const API_URL = `${TOMTOM_BASE_URL}?point=${intersection.lat},${intersection.lng}&key=${TOMTOM_API_KEY}`;

  try {
      const response = await fetch(API_URL);
      if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      const { currentSpeed, freeFlowSpeed } = result.flowSegmentData
      return { name: intersection.name, currentSpeed, freeFlowSpeed} 
  } catch (error) {
    console.error(error.message);
  }
}

function calculateCongestionScore(currentSpeed, freeFlowSpeed) {
  // return currentSpeed / freeFlowSpeed rounded to 4 decimal places
  return(parseFloat((currentSpeed/freeFlowSpeed).toFixed(4)));
}

async function writeToSupabase(reading) {
  // TODO: insert one row into tucson_traffic table
  // reading will contain { name, currentSpeed, freeFlowSpeed, congestionScore }
}

export default async function handler(req, res) {
  // TODO: loop through all INTERSECTIONS
  // TODO: for each one, fetchTrafficData
  // TODO: calculateCongestionScore
  // TODO: writeToSupabase
  // TODO: return a summary of what was collected
}