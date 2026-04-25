
-- 1. Fix function search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- 2. Tighten contact_messages insert policy
DROP POLICY IF EXISTS "Public insert contact" ON public.contact_messages;
CREATE POLICY "Public insert contact"
ON public.contact_messages
FOR INSERT
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 200
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(email) <= 320
  AND length(trim(message)) BETWEEN 1 AND 5000
  AND (subject IS NULL OR length(subject) <= 300)
);
