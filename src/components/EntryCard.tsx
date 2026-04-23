import { useState } from "react";
import { Copy, Eye, EyeOff, Globe, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VaultEntry } from "@/services/vault";
import { passwordStrength } from "@/services/vault";
import { toast } from "sonner";

type Props = {
  entry: VaultEntry;
  onEdit: () => void;
  onDelete: () => void;
};

export function EntryCard({ entry, onEdit, onDelete }: Props) {
  const [show, setShow] = useState(false);
  const strength = passwordStrength(entry.password);
  const strengthColors = ["bg-destructive", "bg-destructive", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Could not copy");
    }
  };

  const initial = entry.name.charAt(0).toUpperCase();

  return (
    <div
      className="group rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ transition: "var(--transition-smooth)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground font-semibold shadow-sm shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{entry.name}</h3>
            {entry.url && (
              <a
                href={entry.url.startsWith("http") ? entry.url : `https://${entry.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate"
              >
                <Globe className="h-3 w-3 shrink-0" />
                {entry.url.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm truncate flex-1">{entry.username}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => copy(entry.username, "Username")}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
          <span className="font-mono text-sm truncate flex-1 tracking-wider">
            {show ? entry.password : "•".repeat(Math.min(entry.password.length, 14))}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShow((s) => !s)}
          >
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => copy(entry.password, "Password")}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="flex gap-1 flex-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < strength.score ? strengthColors[strength.score] : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{strength.label}</span>
        </div>
      </div>
    </div>
  );
}
