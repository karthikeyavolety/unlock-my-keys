import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/lib/auth";
import { toast } from "sonner";

type Mode = "login" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search): { mode: Mode } => ({
    mode: search.mode === "signup" ? "signup" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Vaultix" },
      { name: "description", content: "Access your secure Vaultix password vault." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
    email: z.string().trim().email("Invalid email").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      if (isSignup) {
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
          const errs: Record<string, string> = {};
          parsed.error.issues.forEach((i) => {
            errs[i.path[0] as string] = i.message;
          });
          setErrors(errs);
          return;
        }
        await signup(parsed.data.name, parsed.data.email, parsed.data.password);
        toast.success("Welcome to Vaultix!");
      } else {
        const parsed = loginSchema.safeParse({ email: form.email, password: form.password });
        if (!parsed.success) {
          const errs: Record<string, string> = {};
          parsed.error.issues.forEach((i) => {
            errs[i.path[0] as string] = i.message;
          });
          setErrors(errs);
          return;
        }
        await login(parsed.data.email, parsed.data.password);
        toast.success("Welcome back!");
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--gradient-subtle)" }}>
      <header className="container mx-auto flex items-center justify-between px-4 py-4">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">
                {isSignup ? "Create your vault" : "Welcome back"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignup
                  ? "Start securing your passwords in seconds."
                  : "Sign in to access your vault."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {isSignup && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 shadow-md"
                disabled={loading}
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="text-sm text-center text-muted-foreground mt-6">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                to="/auth"
                search={{ mode: isSignup ? "login" : "signup" }}
                className="text-primary font-medium hover:underline"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
