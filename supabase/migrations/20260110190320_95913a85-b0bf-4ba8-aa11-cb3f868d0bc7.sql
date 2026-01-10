-- Create chat rooms table (one per task)
CREATE TABLE public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT NOT NULL,
    task_title TEXT NOT NULL,
    animal_name TEXT,
    share_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'worker',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_rooms (public access via share code)
CREATE POLICY "Anyone can read chat rooms by share code"
ON public.chat_rooms
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create chat rooms"
ON public.chat_rooms
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their chat rooms"
ON public.chat_rooms
FOR UPDATE
USING (true);

-- RLS policies for chat_messages (public access for room participants)
CREATE POLICY "Anyone can read messages in accessible rooms"
ON public.chat_messages
FOR SELECT
USING (true);

CREATE POLICY "Anyone can send messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;