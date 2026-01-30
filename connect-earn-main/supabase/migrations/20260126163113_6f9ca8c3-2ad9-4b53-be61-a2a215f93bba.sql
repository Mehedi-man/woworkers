-- ============================================
-- ATOMIC FUNCTIONS FOR MULTI-STEP OPERATIONS
-- ============================================

-- 1. Accept Proposal Atomically (creates contract, rejects others, updates job)
CREATE OR REPLACE FUNCTION public.accept_proposal_atomic(
  _proposal_id UUID,
  _job_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _contract_id UUID;
  _client_id UUID;
  _freelancer_id UUID;
  _bid_amount NUMERIC;
  _budget_type TEXT;
BEGIN
  -- Verify authorization and get required data
  SELECT j.client_id, j.budget_type, p.freelancer_id, p.bid_amount
  INTO _client_id, _budget_type, _freelancer_id, _bid_amount
  FROM jobs j
  JOIN proposals p ON p.job_id = j.id
  WHERE j.id = _job_id 
    AND p.id = _proposal_id
    AND j.client_id = auth.uid()
    AND j.status = 'open'
    AND p.status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unauthorized or invalid state: job must be open and proposal must be pending';
  END IF;
  
  -- Accept the selected proposal
  UPDATE proposals SET status = 'accepted', updated_at = now() WHERE id = _proposal_id;
  
  -- Reject all other pending proposals for this job
  UPDATE proposals SET status = 'rejected', updated_at = now() 
  WHERE job_id = _job_id AND id != _proposal_id AND status = 'pending';
  
  -- Create the contract
  INSERT INTO contracts (job_id, client_id, freelancer_id, proposal_id, contract_type, amount, status)
  VALUES (_job_id, _client_id, _freelancer_id, _proposal_id, _budget_type, _bid_amount, 'active')
  RETURNING id INTO _contract_id;
  
  -- Update job status
  UPDATE jobs SET status = 'in-progress', updated_at = now() WHERE id = _job_id;
  
  RETURN _contract_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_proposal_atomic TO authenticated;

-- 2. Complete Contract with Review Atomically
CREATE OR REPLACE FUNCTION public.complete_contract_atomic(
  _contract_id UUID,
  _rating INTEGER,
  _comment TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client_id UUID;
  _freelancer_id UUID;
  _job_id UUID;
  _amount NUMERIC;
BEGIN
  -- Verify authorization and get contract data
  SELECT c.client_id, c.freelancer_id, c.job_id, c.amount
  INTO _client_id, _freelancer_id, _job_id, _amount
  FROM contracts c
  WHERE c.id = _contract_id
    AND c.client_id = auth.uid()
    AND c.status = 'active'
    AND c.delivery_status = 'delivered';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unauthorized or invalid state: contract must be active with delivery submitted';
  END IF;
  
  -- Validate rating
  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;
  
  -- Validate comment length
  IF char_length(_comment) < 10 OR char_length(_comment) > 1000 THEN
    RAISE EXCEPTION 'Comment must be between 10 and 1000 characters';
  END IF;
  
  -- Insert the review
  INSERT INTO reviews (contract_id, client_id, freelancer_id, rating, comment, amount)
  VALUES (_contract_id, _client_id, _freelancer_id, _rating, _comment, _amount);
  
  -- Complete the contract
  UPDATE contracts 
  SET status = 'completed', 
      end_date = now(), 
      delivery_status = 'accepted',
      updated_at = now()
  WHERE id = _contract_id;
  
  -- Update job status
  UPDATE jobs SET status = 'completed', updated_at = now() WHERE id = _job_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_contract_atomic TO authenticated;

-- ============================================
-- RATE LIMITING SYSTEM
-- ============================================

-- Rate limit tracking table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit logs
CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limit_log 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow inserts via triggers only (no direct user insert)
CREATE POLICY "System can insert rate limits" 
ON public.rate_limit_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_action_time 
ON public.rate_limit_log(user_id, action, created_at DESC);

-- Rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _action TEXT,
  _max_count INTEGER,
  _window_seconds INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count INTEGER;
BEGIN
  -- Count recent actions within the window
  SELECT COUNT(*) INTO _count
  FROM rate_limit_log
  WHERE user_id = auth.uid()
    AND action = _action
    AND created_at > now() - (_window_seconds || ' seconds')::INTERVAL;
  
  IF _count >= _max_count THEN
    RETURN FALSE;
  END IF;
  
  -- Log this action
  INSERT INTO rate_limit_log (user_id, action) VALUES (auth.uid(), _action);
  
  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_rate_limit TO authenticated;

-- Rate limit enforcement for messages (10 per minute)
CREATE OR REPLACE FUNCTION public.enforce_message_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_rate_limit('send_message', 10, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 10 messages per minute';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER message_rate_limit
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION enforce_message_rate_limit();

-- Rate limit enforcement for proposals (5 per hour)
CREATE OR REPLACE FUNCTION public.enforce_proposal_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_rate_limit('submit_proposal', 5, 3600) THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 5 proposals per hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER proposal_rate_limit
  BEFORE INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION enforce_proposal_rate_limit();

-- Rate limit enforcement for job postings (3 per hour)
CREATE OR REPLACE FUNCTION public.enforce_job_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_rate_limit('post_job', 3, 3600) THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 3 job postings per hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER job_rate_limit
  BEFORE INSERT ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION enforce_job_rate_limit();

-- Cleanup old rate limit logs (keep last 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM rate_limit_log WHERE created_at < now() - INTERVAL '24 hours';
END;
$$;