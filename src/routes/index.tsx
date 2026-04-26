import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Play, Sparkles, Film, Users, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { resolveTeamPhoto } from "@/lib/team-photos";
import hero from "@/assets/hero-cinematic.jpg";
import t1 from "@/assets/template-1.jpg";
import t2 from "@/assets/template-2.jpg";
import t3 from "@/assets/template-3.jpg";
import ogImage from "@/assets/og-cover.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CapThemeStudio — Cinematic CapCut Templates & Editing" },
      { name: "description", content: "Premium cinematic CapCut templates and custom video editing for creators, brands and storytellers worldwide." },
      { property: "og:title", content: "CapThemeStudio — Cinematic CapCut Templates" },
      { property: "og:description", content: "Premium cinematic CapCut templates and custom video editing for creators worldwide." },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const featured = [t1, t2, t3];

function Home() {
  const { data: team = [] } = useQuery({
    queryKey: ["team-preview"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("display_order").limit(4);
      return data ?? [];
    },
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["agency-reviews-home"],
    queryFn: async () => {
      const { data } = await supabase.from("agency_reviews").select("*").order("display_order").limit(3);
      return data ?? [];
    },
  });

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden film-grain">
        <div className="absolute inset-0">
          <img src={hero} alt="Cinematic editing studio" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-spotlight animate-spotlight" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-44">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Cinematic CapCut Studio
            </span>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
              Tell stories that <span className="text-gradient-gold">move</span> the world.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              We craft premium CapCut templates and custom edits with cinematic color, kinetic motion, and storytelling that hooks viewers in seconds.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95 transition"
              >
                <Play className="h-4 w-4 fill-current" /> View Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-card/50 px-6 py-3 font-semibold text-foreground hover:border-primary/60 transition"
              >
                Start a Project
              </Link>
            </div>
          </motion.div>

          <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { v: "300+", l: "Templates Shipped" },
              { v: "120M+", l: "Views Generated" },
              { v: "85+", l: "Brands Worldwide" },
              { v: "4.9★", l: "Client Rating" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.1}>
                <div className="rounded-xl border border-border/40 bg-card/40 p-5 backdrop-blur">
                  <div className="font-display text-3xl text-gradient-gold">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">What we <span className="text-gradient-cinema">do</span></h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">From viral templates to bespoke cinematic edits — we cover every frame of your story.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Film, title: "CapCut Templates", desc: "Trend-ready, fully editable cinematic templates for creators." },
            { icon: Sparkles, title: "Custom Edits", desc: "From short-form ads to long-form storytelling — done your way." },
            { icon: Users, title: "Brand Partnerships", desc: "Recurring monthly creative for agencies and growing brands." },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="group h-full rounded-2xl border border-border/50 bg-card/40 p-8 transition hover:border-primary/50 hover:shadow-gold">
                <s.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl md:text-5xl">Featured <span className="text-gradient-gold">work</span></h2>
              <p className="mt-3 text-muted-foreground">A glimpse at recent cinematic templates.</p>
            </div>
            <Link to="/portfolio" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((src, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/40">
                <img src={src} alt={`Template ${i + 1}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="font-display text-lg">Cinematic Pack {i + 1}</span>
                  <span className="rounded-full bg-primary/90 p-2 text-primary-foreground"><Play className="h-3 w-3 fill-current" /></span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Meet the <span className="text-gradient-cinema">crew</span></h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <Link
                to="/team/$slug"
                params={{ slug: m.slug }}
                className="group block overflow-hidden rounded-2xl border border-border/40 bg-card/40 transition hover:border-primary/50"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={resolveTeamPhoto(m.photo_url)} alt={m.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <div className="font-display text-lg">{m.name}</div>
                  <div className="text-xs text-primary uppercase tracking-widest">{m.role}</div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Loved by <span className="text-gradient-gold">creators</span></h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.1}>
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

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-cinematic p-12 text-center md:p-20">
          <div className="absolute inset-0 bg-spotlight animate-spotlight" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl">Ready for your <span className="text-gradient-gold">cinematic</span> moment?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Tell us about your project — we'll send a tailored creative direction within 24 hours.</p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-8 py-3 font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95"
            >
              Start the conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
