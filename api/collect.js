// collect.js
// Responsibility: Called by cron job every 15 minutes
// Fetches live traffic for all intersections and writes to Supabase

const TOMTOM_BASE_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json';

// The intersections we are tracking with their coordinates


const INTERSECTIONS = [
  { name: 'Speedway & Swan', lat: 32.2362, lng: -110.8926 },
  { name: 'Speedway & Mountain', lat: 32.236, lng: -110.9524 },
  { name: '6th & Euclid', lat: 32.2278, lng: -110.9595 },
  { name: 'Campbell & River', lat: 32.2872, lng: -110.9438 },
  { name: 'Pima & Country Club', lat: 32.2432, lng: -110.9268 },
  { name: '22nd & Craycroft', lat: 32.2069, lng: -110.8751 },
  { name: '22nd & Park', lat: 32.2068, lng: -110.9562 },
  { name: 'Glenn & Swan', lat: 32.2582, lng: -110.8928 },
  { name: 'Oracle & Ina', lat: 32.3371, lng: -110.9774 },
];

async function fetchTrafficData(intersection) {
  // TODO: build the TomTom API URL using intersection.lat and intersection.lng
  // TODO: make the API call using fetch()
  // TODO: extract currentSpeed and freeFlowSpeed from the response
  // TODO: return { name, currentSpeed, freeFlowSpeed }
}

function calculateCongestionScore(currentSpeed, freeFlowSpeed) {
  // TODO: return currentSpeed / freeFlowSpeed rounded to 4 decimal places
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