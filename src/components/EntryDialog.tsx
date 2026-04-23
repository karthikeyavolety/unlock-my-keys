import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { passwordStrength, type VaultEntry } from "@/services/vault";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: VaultEntry | null;
  onSave: (data: {
    name: string;
    url?: string;
    username: string;
    password: string;
    notes?: string;
  }) => void;
};

const empty = { name: "", url: "", username: "", password: "", notes: "" };

function generatePassword(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export function EntryDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [form, setForm] = useState(empty);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              url: initial.url || "",
              username: initial.username,
              password: initial.password,
              notes: initial.notes || "",
            }
          : empty,
      );
      setShow(false);
    }
  }, [open, initial]);

  const strength = passwordStrength(form.password);
  const strengthColors = ["bg-destructive", "bg-destructive", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.password) return;
    onSave({
      name: form.name.trim(),
      url: form.url.trim() || undefined,
      username: form.username.trim(),
      password: form.password,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit entry" : "New password entry"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update the details below." : "Save a new credential to your vault."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="e-name">Website / App name *</Label>
            <Input
              id="e-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="GitHub"
              required
              maxLength={80}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-url">URL</Label>
            <Input
              id="e-url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://github.com"
              maxLength={300}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-user">Username / Email *</Label>
            <Input
              id="e-user"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="you@example.com"
              required
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-pass">Password *</Label>
            <div className="relative">
              <Input
                id="e-pass"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="pr-20"
                maxLength={200}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setForm({ ...form, password: generatePassword() })}
                  title="Generate strong password"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < strength.score ? strengthColors[strength.score] : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-notes">Notes</Label>
            <Textarea
              id="e-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: "var(--gradient-primary)" }}>
              {initial ? "Save changes" : "Add to vault"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
