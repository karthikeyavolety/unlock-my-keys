import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[image:var(--gradient-primary)]">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </span>
            Helios
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            The billing OS for modern SaaS. Multi-tenant by default.
          </p>
        </div>
        {[
          { title: "Product", items: ["Features", "Pricing", "Changelog", "Roadmap"] },
          { title: "Company", items: ["About", "Customers", "Careers", "Contact"] },
          { title: "Resources", items: ["Docs", "API", "Status", "Security"] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold text-foreground">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i}>
                  <a href="#" className="transition-colors hover:text-foreground">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Helios Labs, Inc. All rights reserved.</p>
          <p>Made for builders. Designed in the dark.</p>
        </div>
      </div>
    </footer>
  );
}
