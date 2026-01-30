-- Create conversations table to link client-freelancer communication
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  freelancer_id UUID NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, freelancer_id, job_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 5000),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversation policies - participants can view their conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Users can create conversations they're part of
CREATE POLICY "Users can create conversations they participate in"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Users can update their conversations (for last_message_at)
CREATE POLICY "Participants can update conversations"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Message policies
CREATE POLICY "Conversation participants can view messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.client_id = auth.uid() OR c.freelancer_id = auth.uid())
    )
  );

-- Participants can send messages
CREATE POLICY "Conversation participants can send messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.client_id = auth.uid() OR c.freelancer_id = auth.uid())
    )
  );

-- Users can update messages (for marking as read)
CREATE POLICY "Recipients can mark messages as read"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.client_id = auth.uid() OR c.freelancer_id = auth.uid())
    )
  );

-- Create indexes for performance
CREATE INDEX messages_conversation_id_idx ON public.messages(conversation_id);
CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);
CREATE INDEX conversations_client_id_idx ON public.conversations(client_id);
CREATE INDEX conversations_freelancer_id_idx ON public.conversations(freelancer_id);
CREATE INDEX conversations_last_message_idx ON public.conversations(last_message_at DESC);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;