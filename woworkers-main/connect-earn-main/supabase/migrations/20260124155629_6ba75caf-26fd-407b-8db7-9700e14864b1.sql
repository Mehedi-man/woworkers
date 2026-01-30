-- Add RLS policy to allow authenticated users to view all profiles
-- This is essential for marketplace functionality where clients need to see freelancer profiles

CREATE POLICY "Authenticated users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);