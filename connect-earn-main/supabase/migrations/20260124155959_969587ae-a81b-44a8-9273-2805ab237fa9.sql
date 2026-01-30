-- Create reviews table for client feedback on completed contracts
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  freelancer_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL CHECK (char_length(comment) >= 10 AND char_length(comment) <= 1000),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
-- Anyone authenticated can view reviews (for freelancer profiles)
CREATE POLICY "Authenticated users can view all reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Only clients can create reviews for their contracts
CREATE POLICY "Clients can create reviews for their contracts"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_id
      AND c.client_id = auth.uid()
    )
  );

-- Create unique constraint to prevent duplicate reviews
CREATE UNIQUE INDEX reviews_contract_id_unique ON public.reviews(contract_id);

-- Create index for faster freelancer lookups
CREATE INDEX reviews_freelancer_id_idx ON public.reviews(freelancer_id);