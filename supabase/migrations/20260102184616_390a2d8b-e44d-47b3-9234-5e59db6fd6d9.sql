-- Fix #1: Add CHECK constraints to profiles table for server-side validation
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_first_name_check 
CHECK (char_length(first_name) <= 100 AND first_name ~ '^[a-zA-Z\s''-]*$');

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_last_name_check 
CHECK (char_length(last_name) <= 100 AND last_name ~ '^[a-zA-Z\s''-]*$');

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_phone_check 
CHECK (phone IS NULL OR (char_length(phone) >= 10 AND char_length(phone) <= 15 AND phone ~ '^[0-9+\-\s()]+$'));

-- Fix #2: Create expenses table with proper RLS for data persistence
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Server-side validation constraints
  CONSTRAINT expenses_amount_positive CHECK (amount > 0),
  CONSTRAINT expenses_category_valid CHECK (category IN ('food', 'transport', 'rent', 'bills', 'other')),
  CONSTRAINT expenses_description_length CHECK (description IS NULL OR char_length(description) <= 500)
);

-- Create index for faster queries by user
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, date DESC);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own expenses
CREATE POLICY "Users can view their own expenses"
ON public.expenses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses"
ON public.expenses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
ON public.expenses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
ON public.expenses
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for automatic timestamp updates on expenses
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix #3: Update handle_new_user function with server-side validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_phone TEXT;
BEGIN
  -- Extract and sanitize values
  v_first_name := COALESCE(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '');
  v_last_name := COALESCE(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '');
  v_phone := TRIM(NEW.raw_user_meta_data ->> 'phone');
  
  -- Validate first_name (allow empty, max 100 chars, letters/spaces/hyphens/apostrophes only)
  IF char_length(v_first_name) > 100 THEN
    v_first_name := LEFT(v_first_name, 100);
  END IF;
  IF v_first_name != '' AND v_first_name !~ '^[a-zA-Z\s''-]+$' THEN
    v_first_name := regexp_replace(v_first_name, '[^a-zA-Z\s''-]', '', 'g');
  END IF;
  
  -- Validate last_name (same rules as first_name)
  IF char_length(v_last_name) > 100 THEN
    v_last_name := LEFT(v_last_name, 100);
  END IF;
  IF v_last_name != '' AND v_last_name !~ '^[a-zA-Z\s''-]+$' THEN
    v_last_name := regexp_replace(v_last_name, '[^a-zA-Z\s''-]', '', 'g');
  END IF;
  
  -- Validate phone (allow null, 10-15 chars, digits/plus/hyphen/spaces/parens only)
  IF v_phone IS NOT NULL THEN
    IF char_length(v_phone) < 10 OR char_length(v_phone) > 15 THEN
      v_phone := NULL;
    ELSIF v_phone !~ '^[0-9+\-\s()]+$' THEN
      v_phone := NULL;
    END IF;
  END IF;
  
  INSERT INTO public.profiles (id, first_name, last_name, phone)
  VALUES (NEW.id, v_first_name, v_last_name, v_phone);
  
  RETURN NEW;
END;
$$;