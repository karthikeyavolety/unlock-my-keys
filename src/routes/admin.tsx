// Generic multi-table admin panel with CRUD, search and pagination.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSession, onAuthChange } from "@/lib/auth";
import {
  createRecord,
  deleteRecord,
  getAll,
  updateRecord,
} from "@/services/db";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Vaultix" },
      { name: "description", content: "Browse and manage your Vaultix tables." },
    ],
  }),
  component: Admin,
});

// Registry of tables exposed in the admin panel. Add new entries to expose more tables.
type FieldType = "text" | "uuid" | "longtext" | "select";
type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  hideOnCreate?: boolean;
};
type TableConfig = {
  table: string;
  label: string;
  searchColumn: string;
  primaryColumns: string[];
  fields: FieldDef[];
};

const TABLES: TableConfig[] = [
  {
    table: "vault_entries",
    label: "Vault entries",
    searchColumn: "name",
    primaryColumns: ["name", "username", "url", "updated_at"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "url", label: "URL", type: "text" },
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "text", required: true },
      { name: "notes", label: "Notes", type: "longtext" },
      { name: "folder_id", label: "Folder ID", type: "uuid" },
    ],
  },
  {
    table: "folders",
    label: "Folders",
    searchColumn: "name",
    primaryColumns: ["name", "color", "created_at"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "color",
        label: "Color",
        type: "select",
        options: ["primary", "blue", "green", "red", "amber", "violet"],
        required: true,
      },
    ],
  },
  {
    table: "shared_entries",
    label: "Shared entries",
    searchColumn: "entry_id",
    primaryColumns: ["entry_id", "recipient_id", "permission", "created_at"],
    fields: [
      { name: "entry_id", label: "Entry ID", type: "uuid", required: true },
      { name: "recipient_id", label: "Recipient user ID", type: "uuid", required: true },
      {
        name: "permission",
        label: "Permission",
        type: "select",
        options: ["view", "edit"],
        required: true,
      },
    ],
  },
  {
    table: "profiles",
    label: "My profile",
    searchColumn: "name",
    primaryColumns: ["name", "email", "created_at"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
    ],
  },
];

const PAGE_SIZE = 10;

function Admin() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTable, setActiveTable] = useState<string>(TABLES[0].table);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const config = useMemo(
    () => TABLES.find((t) => t.table === activeTable) ?? TABLES[0],
    [activeTable],
  );

  useEffect(() => {
    const { data: sub } = onAuthChange((u) => {
      if (!u) navigate({ to: "/auth", search: { mode: "login" } });
      else setAuthChecked(true);
    });
    getSession().then((s) => {
      if (!s) navigate({ to: "/auth", search: { mode: "login" } });
      else setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const { rows, count } = await getAll(config.table, {
        page,
        pageSize: PAGE_SIZE,
        orderBy: { column: "created_at", ascending: false },
        search: search ? { column: config.searchColumn, value: search } : undefined,
      });
      setRows(rows);
      setCount(count);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecked) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, activeTable, page, search]);

  useEffect(() => {
    setPage(1);
  }, [activeTable, search]);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const handleSave = async (values: Record<string, unknown>) => {
    try {
      if (editing) {
        await updateRecord(config.table, String(editing.id), values);
        toast.success("Record updated");
      } else {
        await createRecord(config.table, values);
        toast.success("Record created");
      }
      setEditing(null);
      setCreating(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteRecord(config.table, deletingId);
      toast.success("Record deleted");
      setDeletingId(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild aria-label="Back">
              <Link to="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Logo />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold">Data admin</h1>
          <p className="text-muted-foreground">
            Generic CRUD across your Supabase tables. RLS still applies — you only see your own
            rows.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="w-full md:w-64">
            <Label className="mb-1.5 block text-xs text-muted-foreground">Table</Label>
            <Select value={activeTable} onValueChange={setActiveTable}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TABLES.map((t) => (
                  <SelectItem key={t.table} value={t.table}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="mb-1.5 block text-xs text-muted-foreground">
              Search by {config.searchColumn}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="md:self-end">
            <Button
              onClick={() => {
                setEditing(null);
                setCreating(true);
              }}
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus className="h-4 w-4 mr-1" /> New row
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {config.primaryColumns.map((c) => (
                  <TableHead key={c}>{c}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={config.primaryColumns.length + 1}
                    className="text-center text-muted-foreground py-10"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={config.primaryColumns.length + 1}
                    className="text-center text-muted-foreground py-10"
                  >
                    No rows
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={String(row.id)}>
                    {config.primaryColumns.map((c) => (
                      <TableCell key={c} className="max-w-[240px] truncate">
                        {formatCell(row[c])}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditing(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeletingId(String(row.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? "row" : "rows"} • Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <RecordDialog
        open={creating || !!editing}
        config={config}
        initial={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this row?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the record from {config.label}. This action cannot be undone.
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

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    }
    return value;
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function RecordDialog({
  open,
  config,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  config: TableConfig;
  initial: Record<string, unknown> | null;
  onClose: () => void;
  onSave: (values: Record<string, unknown>) => void | Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const next: Record<string, string> = {};
    for (const f of config.fields) {
      const v = initial?.[f.name];
      next[f.name] = v === null || v === undefined ? "" : String(v);
    }
    setValues(next);
  }, [open, config, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const f of config.fields) {
      const raw = values[f.name];
      if (f.required && !raw) {
        toast.error(`${f.label} is required`);
        return;
      }
      payload[f.name] = raw === "" ? null : raw;
    }
    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit row" : "New row"}</DialogTitle>
          <DialogDescription>
            {config.label} • RLS rules apply automatically on save.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {config.fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={`f-${f.name}`}>
                {f.label}
                {f.required && " *"}
              </Label>
              {f.type === "longtext" ? (
                <textarea
                  id={`f-${f.name}`}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              ) : f.type === "select" ? (
                <Select
                  value={values[f.name] ?? ""}
                  onValueChange={(v) => setValues({ ...values, [f.name]: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose…" />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options?.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`f-${f.name}`}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                />
              )}
            </div>
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: "var(--gradient-primary)" }}>
              {initial ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
