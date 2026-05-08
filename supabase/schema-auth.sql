-- =============================================================================
-- Run this in Supabase: SQL Editor → New query → Paste → Run
-- =============================================================================
--
-- ALSO configure the Dashboard (no SQL):
-- Authentication → Providers → Email: ON
-- Authentication → Email templates: optional
-- Authentication → URL configuration:
--   Site URL: http://localhost:3000  (production: https://your-domain.com)
--   Redirect URLs: add http://localhost:3000/auth/callback
--                     and production https://your-domain.com/auth/callback
--
-- For local dev without email confirmation:
-- Authentication → Providers → Email → disable "Confirm email" (optional)
--
-- PROMOTE ADMIN (after user signs up; copy user id from Authentication → Users):
--   UPDATE public.profiles SET role = 'admin' WHERE id = 'PASTE-USER-UUID';
--
-- =============================================================================

-- Profiles: one row per auth user (role drives /admin vs store)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- No INSERT/UPDATE for normal users → only trigger + service role can change roles
DROP POLICY IF EXISTS "profiles_service_all" ON public.profiles;

-- Trigger: auto-create profile on signup (defaults to customer)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Backfill existing auth users missing a profile (run once after creating table)
INSERT INTO public.profiles (id, role)
SELECT id, 'customer' FROM auth.users
ON CONFLICT (id) DO NOTHING;
