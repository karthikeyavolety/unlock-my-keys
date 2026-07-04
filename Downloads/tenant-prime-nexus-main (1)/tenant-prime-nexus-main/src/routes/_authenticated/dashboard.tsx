import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Helios" }],
  }),
  component: DashboardPage,
});

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.round(1200 + Math.sin(i / 3) * 400 + i * 60 + Math.random() * 200),
}));

const planData = [
  { plan: "Free", count: 642 },
  { plan: "Pro", count: 284 },
  { plan: "Business", count: 96 },
  { plan: "Enterprise", count: 12 },
];

const invoices = [
  { id: "INV-10428", customer: "Nimbus Inc.", amount: "$2,400", status: "paid" },
  { id: "INV-10427", customer: "Forge Labs", amount: "$880", status: "paid" },
  { id: "INV-10426", customer: "Halcyon", amount: "$1,200", status: "pending" },
  { id: "INV-10425", customer: "Vector Co.", amount: "$320", status: "failed" },
  { id: "INV-10424", customer: "Quanta Group", amount: "$4,800", status: "paid" },
];

function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex flex-col">
              <div className="text-sm font-semibold">Overview</div>
              <div className="text-xs text-muted-foreground">Welcome back to Helios</div>
            </div>
          </header>

          <main className="flex-1 space-y-6 p-6">
            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={DollarSign}
                label="MRR"
                value="$48,240"
                delta="+12.4%"
                positive
              />
              <StatCard
                icon={TrendingUp}
                label="ARR"
                value="$578,880"
                delta="+18.2%"
                positive
              />
              <StatCard
                icon={Users}
                label="Active customers"
                value="1,284"
                delta="+38"
                positive
              />
              <StatCard
                icon={CreditCard}
                label="Failed payments"
                value="14"
                delta="-3"
                positive
              />
            </div>

            {/* Charts row */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Revenue</div>
                    <div className="text-xs text-muted-foreground">Last 30 days</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">+12.4% vs prev.</Badge>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.72 0.2 280)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="oklch(0.62 0.18 275)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="oklch(0.68 0.018 265)" fontSize={11} />
                      <YAxis tickLine={false} axisLine={false} stroke="oklch(0.68 0.018 265)" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--popover-foreground)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="oklch(0.72 0.2 280)"
                        strokeWidth={2}
                        fill="url(#rev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="mb-4">
                  <div className="text-sm font-semibold">Plan distribution</div>
                  <div className="text-xs text-muted-foreground">Active subscriptions</div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={planData}>
                      <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                      <XAxis dataKey="plan" tickLine={false} axisLine={false} stroke="oklch(0.68 0.018 265)" fontSize={11} />
                      <YAxis tickLine={false} axisLine={false} stroke="oklch(0.68 0.018 265)" fontSize={11} />
                      <Tooltip
                        cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--popover-foreground)",
                        }}
                      />
                      <Bar dataKey="count" fill="oklch(0.62 0.18 275)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent invoices */}
            <div className="rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <div className="text-sm font-semibold">Recent invoices</div>
                  <div className="text-xs text-muted-foreground">Last 5 transactions</div>
                </div>
                <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                  View all →
                </a>
              </div>
              <div className="divide-y divide-border">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-xs text-muted-foreground">{inv.id}</div>
                      <div className="font-medium">{inv.customer}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="tabular-nums">{inv.amount}</div>
                      <StatusPill status={inv.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty-state nudge */}
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
              <h3 className="text-sm font-semibold">Connect Stripe to unlock real billing</h3>
              <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                We've stubbed the dashboard with demo data. Wire up payments next to see real
                MRR, invoices, and webhooks flow through.
              </p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div
        className={`mt-1 flex items-center gap-1 text-xs ${
          positive ? "text-success" : "text-destructive"
        }`}
      >
        {positive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {delta}
        <span className="text-muted-foreground">vs last period</span>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-success/15 text-success ring-success/30",
    pending: "bg-warning/15 text-warning ring-warning/30",
    failed: "bg-destructive/15 text-destructive ring-destructive/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
