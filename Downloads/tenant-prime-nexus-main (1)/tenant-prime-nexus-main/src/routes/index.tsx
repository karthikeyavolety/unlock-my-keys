import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  Layers,
  Lock,
  Users,
  Webhook,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helios — The billing OS for modern SaaS" },
      {
        name: "description",
        content:
          "Ship multi-tenant SaaS with auth, subscriptions, teams, and analytics in one platform. No Stripe glue code. No homegrown RBAC.",
      },
      { property: "og:title", content: "Helios — The billing OS for modern SaaS" },
      {
        property: "og:description",
        content: "Auth, subscriptions, teams, and analytics — out of the box.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 -z-0 h-[600px]"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>v1.0 — now in early access</span>
            </div>
            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              The billing OS for{" "}
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                modern SaaS
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Multi-tenant auth, subscriptions, teams, and analytics — one
              elegant platform. Stop gluing Stripe to your dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free forever for teams under 3. No credit card required.
            </p>
          </div>

          {/* Hero mock */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div
              className="overflow-hidden rounded-2xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <div className="ml-3 text-xs text-muted-foreground">app.helios.dev/dashboard</div>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-3 hidden border-r border-border bg-sidebar p-4 md:block">
                  {["Overview", "Subscriptions", "Customers", "Invoices", "Team", "Settings"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`mb-1 rounded-md px-3 py-2 text-sm ${i === 0 ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70"}`}
                      >
                        {item}
                      </div>
                    ),
                  )}
                </div>
                <div className="col-span-12 p-6 md:col-span-9">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      { l: "MRR", v: "$48,240", d: "+12.4%" },
                      { l: "Customers", v: "1,284", d: "+38" },
                      { l: "Active subs", v: "962", d: "+4.2%" },
                      { l: "Churn", v: "1.8%", d: "-0.3%" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="rounded-xl border border-border bg-background/40 p-4"
                      >
                        <div className="text-xs text-muted-foreground">{s.l}</div>
                        <div className="mt-1.5 text-xl font-semibold tracking-tight">{s.v}</div>
                        <div className="mt-0.5 text-xs text-success">{s.d}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-56 rounded-xl border border-border bg-background/40 p-4">
                    <div className="text-xs text-muted-foreground">Revenue · last 30 days</div>
                    <svg viewBox="0 0 600 180" className="mt-2 h-full w-full">
                      <defs>
                        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.62 0.18 275)" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="oklch(0.62 0.18 275)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 140 L40 120 L80 130 L120 100 L160 110 L200 80 L240 95 L280 70 L320 85 L360 55 L400 65 L440 40 L480 60 L520 30 L560 45 L600 20 L600 180 L0 180 Z"
                        fill="url(#area)"
                      />
                      <path
                        d="M0 140 L40 120 L80 130 L120 100 L160 110 L200 80 L240 95 L280 70 L320 85 L360 55 L400 65 L440 40 L480 60 L520 30 L560 45 L600 20"
                        fill="none"
                        stroke="oklch(0.72 0.2 280)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo wall */}
      <section className="border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Trusted by ambitious teams
          </p>
          <div className="mt-6 grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
            {["Nimbus", "Forge", "Halcyon", "Vector", "Quanta", "Pylon"].map((n) => (
              <div
                key={n}
                className="text-center font-display text-lg font-semibold tracking-tight text-muted-foreground"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Everything you need</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            One platform. Every billing primitive.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From auth and orgs to invoices and webhooks — the boring parts, done
            right.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              i: Layers,
              t: "Multi-tenant workspaces",
              d: "Organizations, workspaces, and seamless tenant switching baked in.",
            },
            {
              i: Lock,
              t: "Role-based access",
              d: "Super admin, org admin, finance, member — with secure RLS policies.",
            },
            {
              i: CreditCard,
              t: "Subscriptions & invoices",
              d: "Trials, proration, coupons, seat-based — all the Stripe plumbing.",
            },
            {
              i: Users,
              t: "Teams & invites",
              d: "Invite by email, assign roles, audit every change in real time.",
            },
            {
              i: BarChart3,
              t: "Revenue analytics",
              d: "MRR, ARR, churn, LTV, cohort retention — visualised beautifully.",
            },
            {
              i: Webhook,
              t: "Webhooks & API keys",
              d: "Sign, retry, and observe webhooks. Issue scoped API keys per tenant.",
            },
          ].map(({ i: Icon, t, d }) => (
            <div
              key={t}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center sm:p-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ship billing in a weekend.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Spin up a workspace, invite your team, and bill your first customer today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create free account
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/pricing">Compare plans</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
