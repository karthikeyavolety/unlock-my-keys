// Vault service — Supabase-backed CRUD for password entries, folders and shares.
// Passwords are obfuscated with base64 before storage as a placeholder until
// real client-side encryption is added.
import { supabase } from "@/integrations/supabase/client";

export type VaultEntry = {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  url: string | null;
  username: string;
  password: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Folder = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type SharedEntry = {
  id: string;
  entry_id: string;
  owner_id: string;
  recipient_id: string;
  permission: "view" | "edit";
  created_at: string;
};

function encrypt(value: string): string {
  if (typeof window === "undefined") return value;
  return btoa(unescape(encodeURIComponent(value)));
}
function decrypt(value: string): string {
  if (typeof window === "undefined") return value;
  try {
    return decodeURIComponent(escape(atob(value)));
  } catch {
    return value;
  }
}

// ---------- Entries ----------
export async function listEntries(opts: { search?: string; folderId?: string | null } = {}) {
  let q = supabase.from("vault_entries").select("*").order("updated_at", { ascending: false });
  if (opts.folderId !== undefined) {
    q = opts.folderId === null ? q.is("folder_id", null) : q.eq("folder_id", opts.folderId);
  }
  if (opts.search) q = q.ilike("name", `%${opts.search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((e) => ({ ...e, password: decrypt(e.password) })) as VaultEntry[];
}

export async function createEntry(input: {
  name: string;
  url?: string;
  username: string;
  password: string;
  notes?: string;
  folder_id?: string | null;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("vault_entries")
    .insert({
      user_id: u.user.id,
      name: input.name,
      url: input.url ?? null,
      username: input.username,
      password: encrypt(input.password),
      notes: input.notes ?? null,
      folder_id: input.folder_id ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return { ...data, password: decrypt(data.password) } as VaultEntry;
}

export async function updateEntry(
  id: string,
  patch: Partial<{
    name: string;
    url: string | null;
    username: string;
    password: string;
    notes: string | null;
    folder_id: string | null;
  }>,
) {
  const payload: Record<string, unknown> = { ...patch };
  if (typeof patch.password === "string") payload.password = encrypt(patch.password);
  const { data, error } = await supabase
    .from("vault_entries")
    .update(payload as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return { ...data, password: decrypt(data.password) } as VaultEntry;
}

export async function deleteEntry(id: string) {
  const { error } = await supabase.from("vault_entries").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Folders ----------
export async function listFolders() {
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Folder[];
}

export async function createFolder(name: string, color = "primary") {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("folders")
    .insert({ user_id: u.user.id, name, color })
    .select()
    .single();
  if (error) throw error;
  return data as Folder;
}

export async function deleteFolder(id: string) {
  const { error } = await supabase.from("folders").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Shares ----------
export async function listSharesForEntry(entryId: string) {
  const { data, error } = await supabase
    .from("shared_entries")
    .select("*")
    .eq("entry_id", entryId);
  if (error) throw error;
  return (data ?? []) as SharedEntry[];
}

export async function shareEntry(entryId: string, recipientEmail: string, permission: "view" | "edit") {
  // Look up recipient via profiles (RLS limits this to own profile, so this only works
  // if recipient profile is publicly readable OR we use a service-side function).
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", recipientEmail)
    .maybeSingle();
  if (profileErr) throw profileErr;
  if (!profile) throw new Error("No user found with that email");

  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("shared_entries")
    .insert({
      entry_id: entryId,
      owner_id: u.user.id,
      recipient_id: profile.id,
      permission,
    })
    .select()
    .single();
  if (error) throw error;
  return data as SharedEntry;
}

export async function revokeShare(shareId: string) {
  const { error } = await supabase.from("shared_entries").delete().eq("id", shareId);
  if (error) throw error;
}

export function passwordStrength(pwd: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Excellent"];
  return { score: Math.min(score, 4) as 0 | 1 | 2 | 3 | 4, label: labels[Math.min(score, 4)] };
}
