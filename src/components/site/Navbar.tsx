import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Clapperboard } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/our-work", label: "Our Work" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="CapThemeStudio logo" className="h-9 w-9 rounded-md" />
          <span className="font-display text-xl tracking-wide text-gradient-gold">CapThemeStudio</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-foreground/80 hover:text-primary transition-colors"
              activeProps={{ className: "text-primary font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="rounded-md bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow-gold hover:opacity-90 transition"
          >
            Hire Us
          </Link>
        </nav>
        <button
          aria-label="Toggle menu"
          className="md:hidden text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95">
          <nav className="flex flex-col px-6 py-4 gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm py-2 text-foreground/90"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <Clapperboard className="inline h-4 w-4 mr-2 text-primary/70" />
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
