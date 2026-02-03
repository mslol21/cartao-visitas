-- Create analytics table for tracking visits and clicks
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON public.analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Only service role or triggered backend can write to this usually
-- But for simplicity in this app, we might allow authenticated users to view their own analytics
CREATE POLICY "Users can view their own analytics" 
ON public.analytics 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = public.analytics.profile_id 
        AND user_id = auth.uid()
    )
);

-- Allow anonymous/public to insert (for tracking visitors)
CREATE POLICY "Anonymous can insert tracking data" 
ON public.analytics 
FOR INSERT 
WITH CHECK (true);
