import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Helios" },
      {
        name: "description",
        content:
          "Simple, scalable pricing for every stage. Free for small teams. Enterprise-ready when you grow.",
      },
      { property: "og:title", content: "Pricing — Helios" },
      {
        property: "og:description",
        content: "Simple, scalable pricing. Free for small teams.",
      },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  cta: string;
  highlight?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    tagline: "For tinkerers and side projects.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: [
      "Up to 3 team members",
      "1 workspace",
      "Basic analytics",
      "Community support",
    ],
  },
  {
    name: "Pro",
    tagline: "For growing teams who need more.",
    monthly: 29,
    yearly: 24,
    cta: "Start 14-day trial",
    highlight: true,
    features: [
      "Up to 15 team members",
      "Unlimited workspaces",
      "Subscription analytics",
      "Stripe & webhook integrations",
      "Priority email support",
    ],
  },
  {
    name: "Business",
    tagline: "For scaling SaaS companies.",
    monthly: 99,
    yearly: 79,
    cta: "Start trial",
    features: [
      "Unlimited team members",
      "Advanced RBAC",
      "Audit logs",
      "API keys & SLAs",
      "Dedicated success manager",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom for the largest deployments.",
    monthly: -1,
    yearly: -1,
    cta: "Contact sales",
    features: [
      "SAML SSO & SCIM",
      "Custom DPA & MSA",
      "Dedicated infrastructure",
      "24/7 phone support",
    ],
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 -z-0 h-[400px]"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-20 text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Pricing that scales with you
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free. Upgrade when your team grows. Cancel anytime.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setYearly(false)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                !yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Yearly · save 20%
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
                  plan.highlight
                    ? "border-primary/50"
                    : "border-border"
                }`}
                style={
                  plan.highlight
                    ? { boxShadow: "var(--shadow-glow)" }
                    : { boxShadow: "var(--shadow-soft)" }
                }
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[image:var(--gradient-primary)] px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                <div className="mt-6">
                  {price < 0 ? (
                    <div className="text-3xl font-semibold tracking-tight">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tracking-tight">${price}</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  )}
                </div>
                <Button
                  asChild
                  variant={plan.highlight ? "default" : "outline"}
                  className="mt-6 w-full rounded-full"
                >
                  <Link to="/auth" search={{ mode: "signup" }}>
                    {plan.cta}
                  </Link>
                </Button>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center">
          <h3 className="text-lg font-semibold tracking-tight">
            Questions about a specific plan?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We're happy to walk through limits, migrations, and procurement.
          </p>
          <Button variant="outline" className="mt-4 rounded-full">
            Talk to sales
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
