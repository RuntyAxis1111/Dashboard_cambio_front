/*
  # Add Write Policies for Members Growth Table

  1. Changes
    - Add INSERT policy for authenticated users to add members
    - Add UPDATE policy for authenticated users to update members
    - Add DELETE policy for authenticated users to delete members

  2. Security
    - All policies restrict access to authenticated users only
    - Ensures data can be edited through the UI
*/

CREATE POLICY "Authenticated users can insert members growth"
  ON reportes_miembros_growth
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members growth"
  ON reportes_miembros_growth
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete members growth"
  ON reportes_miembros_growth
  FOR DELETE
  TO authenticated
  USING (true);
