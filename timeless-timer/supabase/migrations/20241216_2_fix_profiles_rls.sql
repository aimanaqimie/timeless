-- Fix RLS policy for profile inserts during signup
-- The original policy required auth.uid() = id, but the session isn't established yet during signup

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a new policy that allows inserting if the id exists in auth.users
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (id IN (SELECT id FROM auth.users));
