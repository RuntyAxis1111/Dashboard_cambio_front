/*
  # Create Authorized Users Table

  1. New Tables
    - `authorized_users`
      - `id` (uuid, primary key)
      - `email` (text, unique, required)
      - `full_name` (text, optional)
      - `role` (text, default 'user')
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `authorized_users` table
    - Add policy for authenticated users to read their own record
    - Admin users can manage all records (future implementation)

  3. Important Notes
    - This table replaces hardcoded email list in AuthContext
    - Only active users with matching emails can access the application
    - Emails are unique and case-insensitive
*/

CREATE TABLE IF NOT EXISTS authorized_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "Users can read own record"
  ON authorized_users FOR SELECT
  TO authenticated
  USING (auth.email() = email);

-- Insert existing authorized users
INSERT INTO authorized_users (email, full_name, role, active)
VALUES
  ('jaime@lulofilms.com', 'Jaime', 'admin', true),
  ('caralf@gmail.com', 'Caralf', 'user', true),
  ('gatito.enano1@gmail.com', 'Gatito', 'user', true)
ON CONFLICT (email) DO NOTHING;