import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
  Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingUp, Users, DollarSign, Activity, Target, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AURA IQ" }] }),
  component: Dashboard,
});

const revenueData = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  revenue: Math.round(40 + i * 8 + Math.sin(i) * 12 + Math.random() * 10),
  profit: Math.round(15 + i * 4 + Math.cos(i) * 6 + Math.random() * 6),
}));

const userGrowth = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  users: Math.round(800 + i * 120 + Math.random() * 80),
}));

const trafficSources = [
  { name: "Organic", value: 38, color: "var(--electric)" },
  { name: "Paid", value: 24, color: "var(--neon)" },
  { name: "Referral", value: 18, color: "var(--aqua)" },
  { name: "Social", value: 14, color: "var(--pink-pop)" },
  { name: "Direct", value: 6, color: "var(--yellow-pop)" },
];

const conversionFunnel = [
  { stage: "Visitors", value: 24800 },
  { stage: "Signups", value: 6200 },
  { stage: "Active", value: 3800 },
  { stage: "Paid", value: 1240 },
  { stage: "Retained", value: 980 },
];

type Kpi = {
  label: string; value: string; delta: string; up?: boolean; icon: any; grad: string; spark: number[];
};

const KPIS: Kpi[] = [
  { label: "Total Revenue", value: "$284,920", delta: "+18.2%", up: true, icon: DollarSign, grad: "bg-aurora", spark: [4,6,5,8,7,9,11,10,13,15,14,17] },
  { label: "Active Users", value: "12,480", delta: "+9.4%", up: true, icon: Users, grad: "bg-mint", spark: [10,11,10,12,13,12,14,15,14,16,17,18] },
  { label: "Conversion Rate", value: "4.82%", delta: "+1.3%", up: true, icon: Target, grad: "bg-violet", spark: [3,4,4,5,4,5,5,6,5,6,7,6] },
  { label: "Churn Rate", value: "1.92%", delta: "-0.6%", up: false, icon: Activity, grad: "bg-sunset", spark: [6,5,5,4,5,4,3,4,3,3,2,2] },
  { label: "Avg Session", value: "5m 42s", delta: "+12.0%", up: true, icon: Zap, grad: "bg-aurora", spark: [3,4,5,4,5,6,7,6,7,8,9,8] },
  { label: "Monthly Growth", value: "+22.6%", delta: "vs last mo.", up: true, icon: TrendingUp, grad: "bg-violet", spark: [2,3,4,3,5,6,5,7,8,9,10,12] },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - (v / Math.max(...data)) * 26 - 2}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={pts} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-6 animate-fade-up">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-sm text-muted-foreground">Live signal across your entire business.</p>
          </div>
          <Badge className="bg-mint text-white shadow-soft">
            <span className="mr-2 h-2 w-2 rounded-full bg-white animate-pulse-glow" /> Live · syncing every 5s
          </Badge>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {KPIS.map((k, i) => (
            <Card key={k.label} className="group relative overflow-hidden p-5 shadow-card hover-lift animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${k.grad} opacity-20 blur-2xl transition-opacity group-hover:opacity-30`} />
              <div className="flex items-center justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${k.grad} text-white shadow-soft`}>
                  <k.icon className="h-5 w-5" />
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  k.up ? "text-emerald-pop bg-[color-mix(in_oklab,var(--emerald-pop)_15%,transparent)]"
                       : "text-pink-pop bg-[color-mix(in_oklab,var(--pink-pop)_15%,transparent)]"
                }`}>
                  {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {k.delta}
                </span>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">{k.label}</div>
              <div className="mt-1 text-3xl font-bold tracking-tight">{k.value}</div>
              <div className="mt-3">
                <Sparkline data={k.spark} color={k.up ? "var(--emerald-pop)" : "var(--pink-pop)"} />
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 shadow-card lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Revenue vs Profit</h3>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </div>
              <Badge variant="outline" className="glass">USD</Badge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--electric)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--electric)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--electric)" strokeWidth={2.5} fill="url(#rev)" />
                  <Area type="monotone" dataKey="profit" stroke="var(--neon)" strokeWidth={2.5} fill="url(#prf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 shadow-card">
            <div className="mb-4">
              <h3 className="font-semibold">Traffic Sources</h3>
              <p className="text-xs text-muted-foreground">Share by channel</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trafficSources} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
                    {trafficSources.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 shadow-card lg:col-span-2">
            <div className="mb-4">
              <h3 className="font-semibold">User Growth</h3>
              <p className="text-xs text-muted-foreground">Daily active users · last 14 days</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="users" stroke="var(--aqua)" strokeWidth={3} dot={{ r: 4, fill: "var(--aqua)" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 shadow-card">
            <div className="mb-4">
              <h3 className="font-semibold">Conversion Funnel</h3>
              <p className="text-xs text-muted-foreground">Visitor → Retained</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionFunnel} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis type="category" dataKey="stage" stroke="var(--muted-foreground)" fontSize={12} width={70} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {conversionFunnel.map((_, i) => (
                      <Cell key={i} fill={[
                        "var(--electric)", "var(--neon)", "var(--aqua)", "var(--emerald-pop)", "var(--orange-pop)"
                      ][i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
