import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const name = req.query.intersection;

  if (!name) {
    return res.status(400).json({ error: 'intersection parameter is required' });
  }

  try {
    const { data, error } = await supabase
      .rpc('get_intersection_history', { intersection_name: name });

    if (error) throw new Error(`Supabase error: ${error.message}`);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}