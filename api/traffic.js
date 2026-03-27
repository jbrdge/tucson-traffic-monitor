import { createClient } from '@supabase/supabase-js';
import { INTERSECTIONS } from './intersections.js';


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function getFromSupabase(intersection) {
    // call 
    const { data, error } =  await supabase 
    .from('tucson_traffic') 
    .select('intersection, current_speed, free_flow_speed, congestion_score') // which columns 
    .eq('intersection', intersection.name) // filter: where intersection = name 
    .order('captured_at', { ascending: false }) // newest first
    .limit(1) // only the most recent row

    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data[0]; // data is an array, you want the first (most recent) row

}