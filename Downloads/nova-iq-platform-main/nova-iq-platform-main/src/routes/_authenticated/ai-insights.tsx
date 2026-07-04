import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateAIInsights } from "@/lib/ai-insights.functions";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — AURA IQ" }] }),
  component: AIInsightsPage,
});

function AIInsightsPage() {
  const fetchInsights = useServerFn(generateAIInsights);
  
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["ai-insights"],
    queryFn: () => fetchInsights(),
    staleTime: 5 * 60 * 1000,
  });

  const score = data?.healthScore ?? 0;
  const scoreColor =
    score >= 85 ? "text-emerald-pop" : score >= 65 ? "text-yellow-pop" : "text-pink-pop";

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-up">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet text-white shadow-neon">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
              <p className="text-sm text-muted-foreground">Predictive intelligence across your business.</p>
            </div>
          </div>
          <Button onClick={() => refetch()} disabled={isFetching} className="bg-aurora text-white shadow-glow hover:opacity-95">
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Analyzing..." : "Regenerate"}
          </Button>
        </div>

        {/* Health score */}
        <Card className="relative overflow-hidden p-8 shadow-card">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-aurora opacity-25 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-violet opacity-25 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid place-items-center">
              <div className="relative">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="78" stroke="var(--border)" strokeWidth="12" fill="none" />
                  <circle
                    cx="90" cy="90" r="78" fill="none"
                    stroke="url(#hs)" strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 489} 489`}
                    transform="rotate(-90 90 90)"
                    style={{ transition: "stroke-dasharray 800ms ease" }}
                  />
                  <defs>
                    <linearGradient id="hs" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--electric)" />
                      <stop offset="50%" stopColor="var(--neon)" />
                      <stop offset="100%" stopColor="var(--aqua)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className={`text-5xl font-bold tracking-tight ${scoreColor}`}>{score || "—"}</div>
                    <div className="text-xs text-muted-foreground">Health Score</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Badge className="bg-violet text-white shadow-neon">
                <Sparkles className="mr-1.5 h-3 w-3" /> AI Generated
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold leading-tight">
                {data?.summary ?? "Synthesizing the state of your business..."}
              </h2>
            </div>
          </div>
        </Card>

        {/* Forecast */}
        <div className="grid gap-4 md:grid-cols-3">
          {(data?.forecast ?? []).map((f, i) => (
            <Card key={i} className="p-5 shadow-card hover-lift">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-electric" /> 30-day forecast
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{f.metric}</div>
              <div className="text-2xl font-bold tracking-tight">{f.nextMonth}</div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-aurora" style={{ width: `${Math.round(f.confidence * 100)}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">Confidence {Math.round(f.confidence * 100)}%</div>
            </Card>
          ))}
        </div>

        {/* Opportunities + Risks */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-mint text-white"><Target className="h-4 w-4" /></div>
              <h3 className="font-semibold">Opportunity Radar</h3>
            </div>
            <ul className="space-y-3">
              {(data?.opportunities ?? []).map((o, i) => (
                <li key={i} className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-3">
                  <span className="text-sm">{o.title}</span>
                  <Badge className="bg-emerald-pop text-white">{o.impact}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-sunset text-white"><AlertTriangle className="h-4 w-4" /></div>
              <h3 className="font-semibold">Risk Radar</h3>
            </div>
            <ul className="space-y-3">
              {(data?.risks ?? []).map((r, i) => (
                <li key={i} className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-3">
                  <span className="text-sm">{r.title}</span>
                  <Badge className={
                    r.severity === "high" ? "bg-pink-pop text-white" :
                    r.severity === "medium" ? "bg-orange-pop text-white" :
                    "bg-yellow-pop text-foreground"
                  }>{r.severity}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet text-white"><Lightbulb className="h-4 w-4" /></div>
            <h3 className="font-semibold">AI Recommendations</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(data?.recommendations ?? []).map((r, i) => (
              <div key={i} className="rounded-xl glass p-4 text-sm">
                <div className="mb-2 text-xs font-medium text-aurora">Action {i + 1}</div>
                {r}
              </div>
            ))}
          </div>
        </Card>

        {!data && !isFetching && (
          <p className="text-center text-xs text-muted-foreground">Tap Regenerate to analyze.</p>
        )}
      </div>
    </AppShell>
  );
}
