-- ============================================================
-- NSS 2025 — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the table.
-- ============================================================

-- Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id              BIGSERIAL PRIMARY KEY,
  ticket_id       TEXT NOT NULL UNIQUE,
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,  -- One registration per email
  phone           TEXT NOT NULL,
  organization    TEXT NOT NULL,
  designation     TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN (
                    'military','civil','intelligence',
                    'academic','media','international','industry'
                  )),
  dietary_requirements TEXT,
  emergency_contact    TEXT,
  registered_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_in      BOOLEAN NOT NULL DEFAULT FALSE,
  checked_in_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email     ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id ON registrations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_registrations_category  ON registrations(category);

-- Row Level Security (RLS) — enables Supabase auth protection
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow the API (service role) to insert and read
-- For the anon key, we allow INSERT only (public registration)
CREATE POLICY "Allow public registration inserts"
  ON registrations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admins (authenticated users) can read all registrations
CREATE POLICY "Allow authenticated reads"
  ON registrations FOR SELECT
  TO authenticated
  USING (true);

-- ── Admin stats view ─────────────────────────────────────────
CREATE OR REPLACE VIEW registration_stats AS
  SELECT
    COUNT(*) AS total_registrations,
    COUNT(*) FILTER (WHERE category = 'military')     AS military,
    COUNT(*) FILTER (WHERE category = 'civil')        AS civil,
    COUNT(*) FILTER (WHERE category = 'intelligence') AS intelligence,
    COUNT(*) FILTER (WHERE category = 'academic')     AS academic,
    COUNT(*) FILTER (WHERE category = 'media')        AS media,
    COUNT(*) FILTER (WHERE category = 'international')AS international,
    COUNT(*) FILTER (WHERE category = 'industry')     AS industry,
    COUNT(*) FILTER (WHERE checked_in = TRUE)         AS checked_in_count,
    DATE_TRUNC('hour', MIN(registered_at))            AS first_registration
  FROM registrations;
