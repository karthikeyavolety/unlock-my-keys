import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AIInsights = {
  healthScore: number;
  summary: string;
  opportunities: { title: string; impact: string }[];
  risks: { title: string; severity: "low" | "medium" | "high" }[];
  recommendations: string[];
  forecast: { metric: string; nextMonth: string; confidence: number }[];
};

const FALLBACK: AIInsights = {
  healthScore: 88,
  summary: "Business is trending strongly. Revenue, retention and conversion are all moving in the right direction this quarter.",
  opportunities: [
    { title: "Expand into enterprise tier", impact: "+$48k MRR / qtr" },
    { title: "Launch annual billing discount", impact: "+12% LTV" },
    { title: "Reactivate dormant trial users", impact: "+820 active users" },
  ],
  risks: [
    { title: "Churn rising on Starter plan", severity: "medium" },
    { title: "Paid-channel CAC up 14% MoM", severity: "medium" },
    { title: "Support backlog at 2.4 days", severity: "low" },
  ],
  recommendations: [
    "Introduce an in-app onboarding nudge for Starter users in week 2.",
    "Reallocate 20% of paid spend toward organic content + SEO.",
    "Bundle AI Insights into the Pro tier to drive upgrades.",
  ],
  forecast: [
    { metric: "Revenue", nextMonth: "$312k (+9.8%)", confidence: 0.86 },
    { metric: "Active Users", nextMonth: "13,720 (+9.9%)", confidence: 0.82 },
    { metric: "Churn", nextMonth: "1.74% (-0.18pp)", confidence: 0.71 },
  ],
};

export const generateAIInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<AIInsights> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return FALLBACK;

    const prompt = `You are AURA IQ, an executive AI analyst.
Given this snapshot:
- Revenue this month: $284,920 (+18.2% MoM)
- Active users: 12,480 (+9.4%)
- Conversion rate: 4.82% (+1.3pp)
- Churn: 1.92% (down 0.6pp)
- Avg session: 5m 42s
- Top channels: Organic 38%, Paid 24%, Referral 18%

Return ONLY a single JSON object matching this TypeScript type, no prose, no markdown fences:
{
  "healthScore": number (0-100),
  "summary": string (2-3 sentences),
  "opportunities": { "title": string, "impact": string }[],
  "risks": { "title": string, "severity": "low"|"medium"|"high" }[],
  "recommendations": string[],
  "forecast": { "metric": string, "nextMonth": string, "confidence": number }[]
}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You return only valid minified JSON, never prose." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text().catch(() => ""));
        return FALLBACK;
      }
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content ?? "";
      const parsed = JSON.parse(raw) as AIInsights;
      if (!parsed || typeof parsed.healthScore !== "number") return FALLBACK;
      return parsed;
    } catch (err) {
      console.error("AI insights failure", err);
      return FALLBACK;
    }
  });
