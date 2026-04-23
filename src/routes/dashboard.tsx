import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, Search, Shield, Settings2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EntryCard } from "@/components/EntryCard";
import { EntryDialog } from "@/components/EntryDialog";
import { Link } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSession, logout, onAuthChange, type User } from "@/lib/auth";
import {
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry,
  type VaultEntry,
} from "@/services/vault";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Vault — Vaultix" },
      { name: "description", content: "Your secure password vault." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VaultEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const rows = await listEntries();
      setEntries(rows);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load vault");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: sub } = onAuthChange((u) => {
      if (!u) {
        navigate({ to: "/auth", search: { mode: "login" } });
        return;
      }
      setUser(u);
      refresh();
    });
    getSession().then((s) => {
      if (!s) {
        navigate({ to: "/auth", search: { mode: "login" } });
        return;
      }
      setUser(s);
      refresh();
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.username.toLowerCase().includes(q) ||
        (e.url || "").toLowerCase().includes(q),
    );
  }, [entries, query]);

  const handleSave = async (data: {
    name: string;
    url?: string;
    username: string;
    password: string;
    notes?: string;
  }) => {
    try {
      if (editing) {
        await updateEntry(editing.id, {
          name: data.name,
          url: data.url ?? null,
          username: data.username,
          password: data.password,
          notes: data.notes ?? null,
        });
        toast.success("Entry updated");
      } else {
        await createEntry(data);
        toast.success("Entry added to vault");
      }
      setDialogOpen(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteEntry(deletingId);
      toast.success("Entry deleted");
      setDeletingId(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-muted-foreground mr-2">
              {user.name}
            </span>
            <Button variant="ghost" size="icon" asChild aria-label="Admin">
              <Link to="/admin">
                <Settings2 className="h-5 w-5" />
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your vault</h1>
            <p className="text-muted-foreground mt-1">
              {entries.length} {entries.length === 1 ? "entry" : "entries"} stored securely
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vault..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              className="shadow-md shrink-0"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            Loading your vault…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">
              {query ? "No matches found" : "Your vault is empty"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              {query
                ? "Try a different search term."
                : "Add your first password to get started."}
            </p>
            {!query && (
              <Button
                onClick={() => {
                  setEditing(null);
                  setDialogOpen(true);
                }}
                style={{ background: "var(--gradient-primary)" }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add your first entry
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => {
                  setEditing(entry);
                  setDialogOpen(true);
                }}
                onDelete={() => setDeletingId(entry.id)}
              />
            ))}
          </div>
        )}
      </main>

      <EntryDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        initial={editing}
        onSave={handleSave}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this credential from your vault. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
