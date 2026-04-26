import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl text-gradient-gold">CapThemeStudio</h3>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Cinematic CapCut templates and editing services for creators, brands, and storytellers worldwide.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Youtube, Twitter, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground/70 hover:text-primary hover:border-primary/60 transition"
                aria-label="social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/our-work" className="hover:text-primary">Our Work</Link></li>
            <li><Link to="/portfolio" className="hover:text-primary">Portfolio</Link></li>
            <li><Link to="/team" className="hover:text-primary">Team</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>hello@capthemestudio.xyz</li>
            <li>+1 (415) 555-0100</li>
            <li>Worldwide • Remote</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CapThemeStudio.xyz — Crafted with cinematic precision.
      </div>
    </footer>
  );
}
