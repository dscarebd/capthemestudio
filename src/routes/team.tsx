import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { resolveTeamPhoto } from "@/lib/team-photos";
import { Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import ogImage from "@/assets/og-cover.jpg";

export const Route = createFileRoute("/team")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Team — Meet the Crew | CapThemeStudio" },
      { name: "description", content: "Meet the cinematic crew behind CapThemeStudio — directors, designers, editors and strategists crafting world-class CapCut work." },
      { property: "og:title", content: "Team — CapThemeStudio" },
      { property: "og:description", content: "The directors, designers and editors behind our cinematic CapCut work." },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function TeamPage() {
  const { data: team = [] } = useQuery({
    queryKey: ["team-all"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("display_order");
      return data ?? [];
    },
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["agency-reviews-all"],
    queryFn: async () => {
      const { data } = await supabase.from("agency_reviews").select("*").order("display_order");
      return data ?? [];
    },
  });
  const { data: faqs = [] } = useQuery({
    queryKey: ["agency-faqs"],
    queryFn: async () => {
      const { data } = await supabase.from("agency_faqs").select("*").order("display_order");
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-primary">The Crew</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">Cinematic <span className="text-gradient-gold">storytellers</span></h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">A small, senior team of directors, designers, and editors. Click anyone to read their story.</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <Link
                to="/team/$slug"
                params={{ slug: m.slug }}
                className="group block overflow-hidden rounded-2xl border border-border/40 bg-card/40 transition hover:border-primary/60 hover:shadow-gold"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={resolveTeamPhoto(m.photo_url)} alt={m.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <div className="font-display text-xl">{m.name}</div>
                  <div className="text-xs text-primary uppercase tracking-widest">{m.role}</div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{m.bio}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Agency reviews */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Agency <span className="text-gradient-cinema">reviews</span></h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border/50 bg-card/40 p-6">
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90">"{r.comment}"</p>
                <div className="mt-4 text-sm">
                  <div className="font-semibold">{r.reviewer_name}</div>
                  {r.reviewer_role && <div className="text-xs text-muted-foreground">{r.reviewer_role}</div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Agency FAQs */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl text-center">Agency <span className="text-gradient-gold">FAQ</span></h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => <FaqItem key={f.id} q={f.question} a={f.answer} />)}
        </div>
      </section>
    </PageShell>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 bg-card/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border/40 p-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}
