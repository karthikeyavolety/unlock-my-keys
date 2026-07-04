import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Activity, Brain, Zap, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AURA IQ — Next-Generation AI Analytics Platform" },
      { name: "description", content: "AURA IQ is an AI-native analytics command center. Predict revenue, detect risk, and turn data into decisions in seconds." },
      { property: "og:title", content: "AURA IQ — AI Analytics, Reimagined" },
      { property: "og:description", content: "Predict revenue, detect risk, and turn data into decisions in seconds." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background bg-mesh">
      {/* Floating orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-aurora opacity-40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-sunset opacity-30 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-aurora text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">AURA <span className="text-aurora">IQ</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#ai" className="text-sm text-muted-foreground hover:text-foreground">AI Engine</a>
          <a href="#stack" className="text-sm text-muted-foreground hover:text-foreground">Platform</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/auth"><Button size="sm" className="bg-aurora text-white shadow-glow hover:opacity-95">Get started</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs animate-fade-up">
          <span className="h-2 w-2 rounded-full bg-emerald-pop animate-pulse-glow" />
          New · AI Business Health Score is live
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl animate-fade-up">
          Analytics that <span className="text-aurora">thinks</span> with you.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: "80ms" }}>
          AURA IQ unifies revenue, growth and risk into one luminous command center —
          powered by an AI engine that predicts what happens next.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <Link to="/auth">
            <Button size="lg" className="bg-aurora text-white shadow-glow hover:opacity-95">
              Launch dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#features"><Button size="lg" variant="outline" className="glass">See features</Button></a>
        </div>

        {/* Floating preview card */}
        <div className="mx-auto mt-20 max-w-5xl animate-fade-up" style={{ animationDelay: "240ms" }}>
          <div className="rounded-3xl glass-strong p-3 shadow-card">
            <div className="rounded-2xl bg-background/60 p-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Revenue", value: "$284K", up: "+18.2%", color: "bg-aurora" },
                  { label: "Active Users", value: "12,480", up: "+9.4%", color: "bg-mint" },
                  { label: "Conversion", value: "4.82%", up: "+1.3%", color: "bg-violet" },
                  { label: "Health Score", value: "92", up: "Excellent", color: "bg-sunset" },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl border border-border/60 bg-card p-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{k.label}</span>
                      <div className={`h-2 w-2 rounded-full ${k.color}`} />
                    </div>
                    <div className="mt-2 text-2xl font-bold">{k.value}</div>
                    <div className="text-xs text-emerald-pop">{k.up}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Brain, title: "AI Insights Engine", desc: "Predictive forecasts, churn detection, opportunity & risk radar.", grad: "bg-violet" },
            { icon: TrendingUp, title: "Revenue Intelligence", desc: "MRR, ARR, LTV, cohorts and live revenue health scoring.", grad: "bg-aurora" },
            { icon: Activity, title: "Real-Time Streams", desc: "Live visitors, device analytics and event firehose, instantly.", grad: "bg-mint" },
            { icon: Zap, title: "Smart Reports", desc: "Daily, weekly, monthly reports with one-click PDF & CSV export.", grad: "bg-sunset" },
            { icon: ShieldCheck, title: "Enterprise Auth", desc: "RBAC, session tracking, MFA-ready with Google sign-in built in.", grad: "bg-violet" },
            { icon: Sparkles, title: "Premium UX", desc: "Glassmorphic widgets, animated charts, dark & light modes.", grad: "bg-aurora" },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl glass p-6 hover-lift">
              <div className={`mb-4 inline-grid h-11 w-11 place-items-center rounded-xl ${f.grad} text-white shadow-soft`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} AURA IQ</span>
          <span>Crafted with intelligence ✦</span>
        </div>
      </footer>
    </div>
  );
}
