-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
  budget_min NUMERIC NOT NULL,
  budget_max NUMERIC NOT NULL,
  duration TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'intermediate', 'expert')),
  location TEXT,
  is_remote BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL,
  cover_letter TEXT NOT NULL,
  bid_amount NUMERIC NOT NULL,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  freelancer_id UUID NOT NULL,
  proposal_id UUID REFERENCES public.proposals(id),
  contract_type TEXT NOT NULL CHECK (contract_type IN ('fixed', 'hourly')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'disputed', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Anyone can view open jobs" ON public.jobs FOR SELECT USING (status = 'open' OR client_id = auth.uid());
CREATE POLICY "Clients can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update their own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Clients can delete their own jobs" ON public.jobs FOR DELETE USING (auth.uid() = client_id);

-- Proposals policies
CREATE POLICY "Freelancers can view their own proposals" ON public.proposals FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Clients can view proposals for their jobs" ON public.proposals FOR SELECT USING (EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = proposals.job_id AND jobs.client_id = auth.uid()));
CREATE POLICY "Freelancers can create proposals" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can update their own proposals" ON public.proposals FOR UPDATE USING (auth.uid() = freelancer_id);

-- Contracts policies
CREATE POLICY "Users can view their own contracts" ON public.contracts FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);
CREATE POLICY "Clients can create contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Contract parties can update contracts" ON public.contracts FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Create update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();