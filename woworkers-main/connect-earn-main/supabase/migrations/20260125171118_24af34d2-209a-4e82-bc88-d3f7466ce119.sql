-- Add delivery fields to contracts table
ALTER TABLE public.contracts 
ADD COLUMN delivery_text text,
ADD COLUMN delivered_at timestamp with time zone,
ADD COLUMN delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'accepted', 'revision_requested'));