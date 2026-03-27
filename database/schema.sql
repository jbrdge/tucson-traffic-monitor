CREATE TABLE tucson_traffic (
  id SERIAL PRIMARY KEY,
  intersection TEXT NOT NULL,
  captured_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  congestion_score FLOAT NOT NULL,
  current_speed FLOAT NOT NULL,
  free_flow_speed FLOAT NOT NULL
);