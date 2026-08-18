CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text NOT NULL,
  reservation_date date NOT NULL,
  reservation_time text NOT NULL,
  duration_minutes integer NOT NULL,
  guests integer NOT NULL,
  occasion text,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  source text NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'manual'))
);

CREATE INDEX IF NOT EXISTS reservations_created_at_idx
  ON reservations (created_at DESC);

CREATE INDEX IF NOT EXISTS reservations_schedule_idx
  ON reservations (reservation_date, status);
