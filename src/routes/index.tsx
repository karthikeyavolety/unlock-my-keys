import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Search, Zap, Eye, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import heroImg from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vaultix — Your digital life. Locked. Simplified." },
      {
        name: "description",
        content:
          "Securely store and manage all your passwords in one place. Vaultix is the modern password manager for students, freelancers, and small teams.",
      },
      { property: "og:title", content: "Vaultix — Never forget a password again" },
      {
        property: "og:description",
        content: "Securely store and manage all your passwords in one place.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70 dark:bg-background/75 backdrop-blur-[2px]" />
        </div>
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <Lock className="h-3.5 w-3.5" />
              End-to-end encrypted vault
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Never forget a{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                password
              </span>{" "}
              again
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Securely store and manage all your passwords in one place. Built for students,
              freelancers, and teams who care about security.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 text-base shadow-lg"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                <Link to="/auth" search={{ mode: "login" }}>
                  I already have an account
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Free forever · No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need. Nothing you don't.</h2>
          <p className="mt-4 text-muted-foreground">
            A clean, fast, secure password manager for your everyday digital life.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Encrypted vault",
              desc: "Your credentials are encrypted before storage, ready for backend integration.",
            },
            {
              icon: Zap,
              title: "Quick copy",
              desc: "One-click copy for usernames and passwords — no more typing.",
            },
            {
              icon: Search,
              title: "Instant search",
              desc: "Find any account in milliseconds with smart filtering.",
            },
            {
              icon: KeyRound,
              title: "Strength meter",
              desc: "Know how strong your passwords really are, instantly.",
            },
            {
              icon: Eye,
              title: "Show / hide",
              desc: "Reveal passwords only when you need them.",
            },
            {
              icon: Lock,
              title: "Private by design",
              desc: "Your data belongs to you. Period.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              style={{ transition: "var(--transition-smooth)" }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div
          className="rounded-3xl p-10 md:p-16 text-center text-primary-foreground shadow-xl"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold">Ready to lock it down?</h2>
          <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
            Join Vaultix today and take back control of your digital life.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="mt-8 h-12 px-8 text-base shadow-lg"
          >
            <Link to="/auth" search={{ mode: "signup" }}>
              Create your free vault
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Vaultix. Your digital life. Locked. Simplified.
      </footer>
    </div>
  );
}
