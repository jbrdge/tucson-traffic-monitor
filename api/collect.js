// collect.js
// Responsibility: Called by cron job every 15 minutes
// Fetches live traffic for all intersections and writes to Supabase
import { createClient } from '@supabase/supabase-js';
import { INTERSECTIONS } from './intersections.js';

const TOMTOM_BASE_URL = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json';
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);



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
  const { error } = await supabase
    .from('tucson_traffic')
    .insert({ 
      intersection: reading.name, 
      current_speed: reading.currentSpeed,
      free_flow_speed: reading.freeFlowSpeed,
      congestion_score: calculateCongestionScore(reading.currentSpeed, reading.freeFlowSpeed)
    });

  if (error) throw new Error(`Supabase error: ${error.message}`);
}

export default async function handler(req, res) {
  try {
    for (const intersection of INTERSECTIONS) {
      const reading = await fetchTrafficData(intersection);
      await writeToSupabase(reading);
    }
    res.status(200).json({ status: 'ok', message: `Collected ${INTERSECTIONS.length} readings` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}