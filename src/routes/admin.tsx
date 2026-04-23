import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

import { getSession, onAuthChange } from "../lib/auth";
import { createRecord, deleteRecord, getAll, updateRecord } from "../services/db";

import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = onAuthChange((u) => {
      if (!u) navigate({ to: "/auth" });
    });

    getSession().then((s) => {
      if (!s) navigate({ to: "/auth" });
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAll("vault_entries");
      setRows(data.rows || []);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-6">
        <Link to="/dashboard">
          <ArrowLeft />
        </Link>
        <Logo />
        <ThemeToggle />
      </header>

      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <Button onClick={load}>
        <Plus className="mr-2" /> Reload
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-4">
          {rows.map((r) => (
            <div key={r.id} className="border p-2 mb-2">
              {JSON.stringify(r)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}