import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Play } from "lucide-react";
import t1 from "@/assets/template-1.jpg";
import t2 from "@/assets/template-2.jpg";
import t3 from "@/assets/template-3.jpg";
import t4 from "@/assets/template-4.jpg";
import t5 from "@/assets/template-5.jpg";
import t6 from "@/assets/template-6.jpg";
import portfolioCover from "@/assets/portfolio-cover.jpg";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Portfolio — Cinematic CapCut Templates | CapThemeStudio" },
      { name: "description", content: "Browse our cinematic CapCut templates and custom edit work. Filter by category — trending, brand, lifestyle, and more." },
      { property: "og:title", content: "Portfolio — CapThemeStudio" },
      { property: "og:description", content: "Cinematic CapCut templates and custom edits — our latest work." },
      { property: "og:image", content: portfolioCover },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { src: t1, title: "Neo Noir Vlog", cat: "Lifestyle" },
  { src: t2, title: "Brand Reveal", cat: "Brand" },
  { src: t3, title: "Trend Burst", cat: "Trending" },
  { src: t4, title: "Travel Diary", cat: "Lifestyle" },
  { src: t5, title: "Product Drop", cat: "Brand" },
  { src: t6, title: "Music Beats", cat: "Trending" },
];

const cats = ["All", "Trending", "Brand", "Lifestyle"] as const;

function Portfolio() {
  const [filter, setFilter] = useState<(typeof cats)[number]>("All");
  const filtered = filter === "All" ? items : items.filter((i) => i.cat === filter);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-primary">Selected Work</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">The <span className="text-gradient-gold">portfolio</span></h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">A growing library of cinematic CapCut templates and custom edits.</p>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-foreground/70 hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.05}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/40">
                <img src={it.src} alt={it.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-full bg-primary p-4 text-primary-foreground shadow-glow-gold">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs uppercase tracking-widest text-primary">{it.cat}</div>
                  <div className="font-display text-xl">{it.title}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
