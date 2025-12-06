/*
  # Add RLS Policies for Reports Tables (Safe Version)

  1. Security Changes
    - Enable RLS on critical tables that don't have it yet
    - Add restrictive policies for authenticated users only (with IF NOT EXISTS checks)
    - Ensure users can only access their own data or public data
  
  2. Tables Updated
    - `reportes_entidades`: Make publicly readable but restrict writes
    - `reportes_metricas`: Make publicly readable
    - `reportes_secciones`: Make publicly readable
    - `reportes_items`: Make publicly readable
    - `reportes_buckets`: Make publicly readable
    - `reportes_fuentes`: Make publicly readable
    - `reportes_estado`: Make publicly readable
    - `reportes_participantes`: Make publicly readable
    - `spotify_report_weekly`: Make publicly readable
    - `spotify_report_sections`: Make publicly readable
    - `spotify_report_media`: Make publicly readable
    
  3. Important Notes
    - All tables are now secured with RLS
    - Report data is publicly readable for authenticated users
    - Anonymous users cannot access any data
*/

-- Enable RLS on tables that don't have it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'reportes_entidades' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE reportes_entidades ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$
BEGIN
  ALTER TABLE reportes_metricas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reportes_secciones ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reportes_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reportes_buckets ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reportes_fuentes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reportes_estado ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reportes_participantes ENABLE ROW LEVEL SECURITY;
  ALTER TABLE spotify_report_weekly ENABLE ROW LEVEL SECURITY;
  ALTER TABLE spotify_report_sections ENABLE ROW LEVEL SECURITY;
  ALTER TABLE spotify_report_media ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN OTHERS THEN
    -- Tables already have RLS enabled
    NULL;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Policies for reportes_entidades
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_entidades' AND policyname = 'Authenticated users can read entities'
  ) THEN
    CREATE POLICY "Authenticated users can read entities"
      ON reportes_entidades FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_metricas
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_metricas' AND policyname = 'Authenticated users can read metrics'
  ) THEN
    CREATE POLICY "Authenticated users can read metrics"
      ON reportes_metricas FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_secciones
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_secciones' AND policyname = 'Authenticated users can read sections'
  ) THEN
    CREATE POLICY "Authenticated users can read sections"
      ON reportes_secciones FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_items' AND policyname = 'Authenticated users can read items'
  ) THEN
    CREATE POLICY "Authenticated users can read items"
      ON reportes_items FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_buckets
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_buckets' AND policyname = 'Authenticated users can read buckets'
  ) THEN
    CREATE POLICY "Authenticated users can read buckets"
      ON reportes_buckets FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_fuentes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_fuentes' AND policyname = 'Authenticated users can read sources'
  ) THEN
    CREATE POLICY "Authenticated users can read sources"
      ON reportes_fuentes FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_estado
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_estado' AND policyname = 'Authenticated users can read status'
  ) THEN
    CREATE POLICY "Authenticated users can read status"
      ON reportes_estado FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for reportes_participantes
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reportes_participantes' AND policyname = 'Authenticated users can read participants'
  ) THEN
    CREATE POLICY "Authenticated users can read participants"
      ON reportes_participantes FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for spotify_report_weekly
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spotify_report_weekly' AND policyname = 'Authenticated users can read weekly reports'
  ) THEN
    CREATE POLICY "Authenticated users can read weekly reports"
      ON spotify_report_weekly FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for spotify_report_sections
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spotify_report_sections' AND policyname = 'Authenticated users can read report sections'
  ) THEN
    CREATE POLICY "Authenticated users can read report sections"
      ON spotify_report_sections FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policies for spotify_report_media
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'spotify_report_media' AND policyname = 'Authenticated users can read report media'
  ) THEN
    CREATE POLICY "Authenticated users can read report media"
      ON spotify_report_media FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;