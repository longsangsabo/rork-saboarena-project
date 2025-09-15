-- Initial setup migration for clean development
-- This file serves as the starting point for new migrations

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create basic audit trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  max_participants INTEGER NOT NULL DEFAULT 16,
  entry_fee INTEGER DEFAULT 0,
  total_prize INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'registration_open' CHECK (status IN ('registration_open', 'in_progress', 'completed', 'cancelled')),
  club_id UUID,
  start_time TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add triggers for updated_at
CREATE TRIGGER set_timestamp_tournaments
  BEFORE UPDATE ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_clubs
  BEFORE UPDATE ON clubs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for now)
CREATE POLICY "Allow public read access on tournaments" ON tournaments
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on tournaments" ON tournaments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on tournament_participants" ON tournament_participants
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on tournament_participants" ON tournament_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on clubs" ON clubs
  FOR SELECT USING (true);

-- Insert sample data
INSERT INTO clubs (id, name, description, location) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'SABO Elite Club', 'Câu lạc bộ bi-a chuyên nghiệp hàng đầu', 'TP.HCM'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Elite Billiards', 'Câu lạc bộ bi-a cho mọi trình độ', 'Hà Nội')
ON CONFLICT (id) DO NOTHING;

-- Migration tracking
INSERT INTO supabase_migrations.schema_migrations (version, statements, name)
VALUES ('00000000000001', 1, 'initial_setup')
ON CONFLICT (version) DO NOTHING;
