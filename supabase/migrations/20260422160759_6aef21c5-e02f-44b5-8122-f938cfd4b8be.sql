
-- FOLDERS
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'primary',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own folders" ON public.folders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own folders" ON public.folders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own folders" ON public.folders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own folders" ON public.folders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER folders_set_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_folders_user ON public.folders(user_id);

-- VAULT ENTRIES
CREATE TABLE public.vault_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  url TEXT,
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vault_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_vault_entries_user ON public.vault_entries(user_id);
CREATE INDEX idx_vault_entries_folder ON public.vault_entries(folder_id);
CREATE INDEX idx_vault_entries_updated ON public.vault_entries(updated_at DESC);

CREATE TRIGGER vault_entries_set_updated_at
  BEFORE UPDATE ON public.vault_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SHARED ENTRIES (many-to-many: entry <-> recipient user)
CREATE TYPE public.share_permission AS ENUM ('view', 'edit');

CREATE TABLE public.shared_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.vault_entries(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission public.share_permission NOT NULL DEFAULT 'view',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entry_id, recipient_id)
);

ALTER TABLE public.shared_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_shared_entries_recipient ON public.shared_entries(recipient_id);
CREATE INDEX idx_shared_entries_owner ON public.shared_entries(owner_id);

-- Security definer helper to check share access without recursion
CREATE OR REPLACE FUNCTION public.user_can_access_entry(_entry_id UUID, _user_id UUID, _need_edit BOOLEAN)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.vault_entries WHERE id = _entry_id AND user_id = _user_id
  ) OR EXISTS (
    SELECT 1 FROM public.shared_entries
    WHERE entry_id = _entry_id
      AND recipient_id = _user_id
      AND (NOT _need_edit OR permission = 'edit')
  );
$$;

-- Vault entry policies (owners + shared recipients)
CREATE POLICY "Users view own or shared entries" ON public.vault_entries
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.user_can_access_entry(id, auth.uid(), false));

CREATE POLICY "Users insert own entries" ON public.vault_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners or edit-shared can update" ON public.vault_entries
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.user_can_access_entry(id, auth.uid(), true));

CREATE POLICY "Owners delete entries" ON public.vault_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Shared entries policies
CREATE POLICY "Owner or recipient view shares" ON public.shared_entries
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_id OR auth.uid() = recipient_id);

CREATE POLICY "Owner creates shares" ON public.shared_entries
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id AND EXISTS (
    SELECT 1 FROM public.vault_entries WHERE id = entry_id AND user_id = auth.uid()
  ));

CREATE POLICY "Owner updates shares" ON public.shared_entries
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Owner or recipient deletes shares" ON public.shared_entries
  FOR DELETE TO authenticated USING (auth.uid() = owner_id OR auth.uid() = recipient_id);
