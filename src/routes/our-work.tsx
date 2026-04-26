import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Film, Palette, Wand2, Music, Camera, Layers } from "lucide-react";
import ogImage from "@/assets/og-cover.jpg";

export const Route = createFileRoute("/our-work")({
  component: OurWork,
  head: () => ({
    meta: [
      { title: "Our Work — Services | CapThemeStudio" },
      { name: "description", content: "Cinematic CapCut template design, custom editing, color grading, sound design and brand creative — full process and services." },
      { property: "og:title", content: "Our Work — CapThemeStudio Services" },
      { property: "og:description", content: "Full creative services: cinematic templates, custom edits, color, sound, motion." },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const services = [
  { icon: Film, title: "Template Design", desc: "Trend-ready CapCut templates engineered to convert scrolls into watch time." },
  { icon: Palette, title: "Cinematic Color", desc: "Custom LUTs and color grades that give every clip a film-grade mood." },
  { icon: Wand2, title: "Motion & Transitions", desc: "Hand-keyframed transitions that feel like Hollywood on a phone screen." },
  { icon: Music, title: "Sound Design", desc: "Layered SFX and rhythmic edits synced to the beat for max retention." },
  { icon: Camera, title: "Concept Direction", desc: "Storyboarded creative direction from hook to outro." },
  { icon: Layers, title: "Brand Systems", desc: "Reusable template systems so your brand stays cinematic at scale." },
];

const process = [
  { n: "01", t: "Discover", d: "We dig into your audience, brand, and goals." },
  { n: "02", t: "Direct", d: "Storyboards, references and a clear creative direction." },
  { n: "03", t: "Craft", d: "We design, edit, color, and score every frame." },
  { n: "04", t: "Deliver", d: "Polished CapCut files plus exports — ready to publish." },
];

function OurWork() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-primary">What We Offer</span>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">Services with <span className="text-gradient-gold">cinematic edge</span></h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">From a single hero edit to a year-long template system — we tailor every engagement to your story.</p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="group h-full rounded-2xl border border-border/50 bg-card/40 p-7 transition hover:border-primary/60 hover:shadow-gold">
                <s.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl">Our <span className="text-gradient-cinema">process</span></h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="rounded-2xl border border-border/40 bg-card/30 p-6">
                <div className="font-display text-4xl text-gradient-gold">{p.n}</div>
                <div className="mt-3 font-display text-xl">{p.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
