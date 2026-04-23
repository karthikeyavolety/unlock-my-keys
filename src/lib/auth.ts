// Auth backed by Lovable Cloud (Supabase).
import { supabase } from "@/integrations/supabase/client";

export type User = { id: string; name: string; email: string };

export async function getSession(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  const u = data.session?.user;
  if (!u) return null;
  const name =
    (u.user_metadata?.name as string | undefined) ||
    (u.email ? u.email.split("@")[0] : "User");
  return { id: u.id, name, email: u.email ?? "" };
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  const redirectUrl = `${window.location.origin}/dashboard`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: { name },
    },
  });
  if (error) throw new Error(error.message);
  const u = data.user;
  if (!u) throw new Error("Signup failed");
  return { id: u.id, name, email: u.email ?? email };
}

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const u = data.user;
  if (!u) throw new Error("Login failed");
  const name =
    (u.user_metadata?.name as string | undefined) ||
    (u.email ? u.email.split("@")[0] : "User");
  return { id: u.id, name, email: u.email ?? email };
}

export async function logout() {
  await supabase.auth.signOut();
}

export function onAuthChange(cb: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    const u = session?.user;
    if (!u) {
      cb(null);
      return;
    }
    const name =
      (u.user_metadata?.name as string | undefined) ||
      (u.email ? u.email.split("@")[0] : "User");
    cb({ id: u.id, name, email: u.email ?? "" });
  });
}
