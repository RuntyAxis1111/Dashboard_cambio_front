/*
  # Create Newsletter Subscribers Table

  1. New Tables
    - `subscriptores_newsletter_general`
      - `id` (uuid, primary key) - Unique identifier for each subscriber
      - `email` (text, unique, not null) - Subscriber email address
      - `nombre` (text) - Subscriber name (optional)
      - `estado` (text) - Subscription status: 'activo', 'pausado', 'cancelado'
      - `fecha_suscripcion` (timestamptz) - Subscription date
      - `fecha_cancelacion` (timestamptz) - Cancellation date (nullable)
      - `fecha_ultimo_envio` (timestamptz) - Last newsletter send date (nullable)
      - `token_unsub` (uuid) - Unique token for unsubscribe link
      - `preferencias` (jsonb) - JSON field for future preferences
      - `acepto_terminos` (boolean) - Terms acceptance flag
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `subscriptores_newsletter_general` table
    - Add policy for authenticated users to read all subscribers
    - Add policy for authenticated users to insert new subscribers
    - Add policy for authenticated users to update subscribers
    - Add policy for authenticated users to delete subscribers

  3. Indexes
    - Unique index on email
    - Index on estado for filtering active subscribers
    - Index on token_unsub for unsubscribe links

  4. Notes
    - Email validation enforced at database level
    - Token for secure unsubscribe functionality
    - N8N can query active subscribers using service role key
    - Estado defaults to 'activo' on creation
*/

-- Create subscriptores_newsletter_general table
CREATE TABLE IF NOT EXISTS subscriptores_newsletter_general (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nombre text,
  estado text NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'cancelado')),
  fecha_suscripcion timestamptz DEFAULT now(),
  fecha_cancelacion timestamptz,
  fecha_ultimo_envio timestamptz,
  token_unsub uuid UNIQUE DEFAULT gen_random_uuid(),
  preferencias jsonb DEFAULT '{}'::jsonb,
  acepto_terminos boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptores_email 
  ON subscriptores_newsletter_general(email);

CREATE INDEX IF NOT EXISTS idx_subscriptores_estado 
  ON subscriptores_newsletter_general(estado);

CREATE INDEX IF NOT EXISTS idx_subscriptores_token 
  ON subscriptores_newsletter_general(token_unsub);

CREATE INDEX IF NOT EXISTS idx_subscriptores_fecha_suscripcion 
  ON subscriptores_newsletter_general(fecha_suscripcion DESC);

-- Enable Row Level Security
ALTER TABLE subscriptores_newsletter_general ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read all subscribers
CREATE POLICY "Authenticated users can read newsletter subscribers"
  ON subscriptores_newsletter_general
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert new subscribers
CREATE POLICY "Authenticated users can insert newsletter subscribers"
  ON subscriptores_newsletter_general
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update subscribers
CREATE POLICY "Authenticated users can update newsletter subscribers"
  ON subscriptores_newsletter_general
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete subscribers
CREATE POLICY "Authenticated users can delete newsletter subscribers"
  ON subscriptores_newsletter_general
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_subscriptores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_subscriptores_updated_at
  BEFORE UPDATE ON subscriptores_newsletter_general
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptores_updated_at();
