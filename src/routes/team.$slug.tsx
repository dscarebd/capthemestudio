import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { resolveTeamPhoto } from "@/lib/team-photos";
import {
  Mail,
  Phone,
  ArrowLeft,
  Star,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Award,
  MapPin,
  Calendar,
  Film,
  Instagram,
  Linkedin,
  Twitter,
  Quote,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/team/$slug")({
  loader: async ({ params }) => {
    const { data: member } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle();
    if (!member) throw notFound();
    const { data: others } = await supabase
      .from("team_members")
      .select("id,name,role,slug,photo_url")
      .neq("id", member.id)
      .order("display_order")
      .limit(3);
    return { member, others: others ?? [] };
  },
  component: MemberPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl">Member not found</h1>
        <Link to="/team" className="mt-6 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to team
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </div>
    </PageShell>
  ),
  head: ({ loaderData }) => {
    const m = loaderData?.member;
    if (!m) return { meta: [{ title: "Team Member | CapThemeStudio" }] };
    return {
      meta: [
        { title: `${m.name} — ${m.role} | CapThemeStudio` },
        { name: "description", content: m.bio?.slice(0, 160) ?? `${m.name}, ${m.role} at CapThemeStudio.` },
        { property: "og:title", content: `${m.name} — ${m.role}` },
        { property: "og:description", content: m.bio?.slice(0, 160) ?? "" },
      ],
    };
  },
});

type RoleProfile = {
  highlights: { icon: typeof Film; label: string; value: string }[];
  journey: { year: string; title: string; org: string; desc: string }[];
  practices: string[];
  location: string;
  joined: string;
};

const ROLE_PROFILES: Record<string, RoleProfile> = {
  "aiden-cole": {
    highlights: [
      { icon: Film, label: "Films directed", value: "240+" },
      { icon: Award, label: "Festival awards", value: "12" },
      { icon: CheckCircle2, label: "Brand partners", value: "60+" },
    ],
    journey: [
      { year: "2024", title: "Creative Director", org: "CapThemeStudio", desc: "Sets the visual language across every cinematic CapCut release." },
      { year: "2021", title: "Co-founded CapThemeStudio", org: "CapThemeStudio", desc: "Launched the studio to bring film-grade craft to short-form video." },
      { year: "2017", title: "Commercial Director", org: "Independent", desc: "Directed campaigns for global lifestyle and beauty brands." },
    ],
    practices: [
      "Cinematic direction & storyboarding",
      "Color science & LUT design",
      "Brand-led creative strategy",
    ],
    location: "Los Angeles, USA",
    joined: "Founded 2021",
  },
  "maya-reyes": {
    highlights: [
      { icon: Film, label: "Templates designed", value: "180+" },
      { icon: Award, label: "Featured by CapCut", value: "06" },
      { icon: CheckCircle2, label: "5★ ratings", value: "98%" },
    ],
    journey: [
      { year: "2024", title: "Lead Template Designer", org: "CapThemeStudio", desc: "Owns the studio's flagship CapCut template library end-to-end." },
      { year: "2022", title: "Senior Motion Designer", org: "CapThemeStudio", desc: "Built our signature kinetic typography system." },
      { year: "2018", title: "Motion Designer", org: "Boutique studio", desc: "Designed motion identities for tech and music brands." },
    ],
    practices: [
      "Kinetic typography systems",
      "Trend-ready transitions & FX",
      "Modular template architecture",
    ],
    location: "Barcelona, Spain",
    joined: "Joined 2022",
  },
  "jonas-kim": {
    highlights: [
      { icon: Film, label: "Edits delivered", value: "500+" },
      { icon: Award, label: "Viral videos", value: "40+" },
      { icon: CheckCircle2, label: "On-time rate", value: "99%" },
    ],
    journey: [
      { year: "2024", title: "Senior Video Editor", org: "CapThemeStudio", desc: "Edits long-form cinematic stories and brand documentaries." },
      { year: "2021", title: "Joined CapThemeStudio", org: "CapThemeStudio", desc: "Brought broadcast-grade pacing into our short-form workflow." },
      { year: "2016", title: "Post-production Editor", org: "TV network", desc: "Edited weekly broadcast features and music documentaries." },
    ],
    practices: [
      "Beat-mapped narrative pacing",
      "Multi-cam editing & sync",
      "Sound design & mixing",
    ],
    location: "Seoul, South Korea",
    joined: "Joined 2021",
  },
  "sofia-lang": {
    highlights: [
      { icon: Film, label: "Clients onboarded", value: "300+" },
      { icon: Award, label: "Net Promoter Score", value: "72" },
      { icon: CheckCircle2, label: "Retention rate", value: "94%" },
    ],
    journey: [
      { year: "2024", title: "Client Success Manager", org: "CapThemeStudio", desc: "Bridges creative teams and clients across every cinematic project." },
      { year: "2022", title: "Joined CapThemeStudio", org: "CapThemeStudio", desc: "Built the studio's onboarding and creative briefing system." },
      { year: "2018", title: "Account Director", org: "Creative agency", desc: "Managed multi-million dollar accounts for global brands." },
    ],
    practices: [
      "Creative briefing & scoping",
      "Project orchestration",
      "Long-term partnerships",
    ],
    location: "London, UK",
    joined: "Joined 2022",
  },
};

const DEFAULT_PROFILE: RoleProfile = {
  highlights: [
    { icon: Film, label: "Projects shipped", value: "120+" },
    { icon: Award, label: "Industry awards", value: "08" },
    { icon: CheckCircle2, label: "Client retention", value: "96%" },
  ],
  journey: [
    { year: "2024", title: "Senior Creative Lead", org: "CapThemeStudio", desc: "Leading flagship cinematic CapCut packs and brand campaigns." },
    { year: "2022", title: "Joined CapThemeStudio", org: "CapThemeStudio", desc: "Brought motion-first storytelling into our core editing workflow." },
    { year: "2019", title: "Independent Editor", org: "Freelance", desc: "Edited 200+ short-form pieces for global creators and DTC brands." },
  ],
  practices: [
    "Cinematic color grading & LUT design",
    "Beat-mapped motion editing",
    "Brand storytelling for short-form",
  ],
  location: "Worldwide • Remote",
  joined: "Joined 2022",
};

function MemberPage() {
  const { member, others } = Route.useLoaderData();
  const { data: faqs = [] } = useQuery({
    queryKey: ["team-faqs", member.id],
    queryFn: async () => {
      const { data } = await supabase.from("team_faqs").select("*").eq("member_id", member.id).order("display_order");
      return data ?? [];
    },
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["team-reviews", member.id],
    queryFn: async () => {
      const { data } = await supabase.from("team_reviews").select("*").eq("member_id", member.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const firstName = member.name.split(" ")[0];
  const profile = ROLE_PROFILES[member.slug] ?? DEFAULT_PROFILE;

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-spotlight" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-16 md:pt-14 md:pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/team" className="hover:text-primary">Team</Link>
            <span>/</span>
            <span className="text-foreground">{member.name}</span>
          </nav>

          <div className="mt-10 grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-start">
            {/* Portrait */}
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-cinematic">
                  <img
                    src={resolveTeamPhoto(member.photo_url)}
                    alt={member.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    Available for projects
                  </div>
                </div>

                {/* Floating rating chip */}
                {avgRating && (
                  <div className="absolute -bottom-5 -right-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-gold">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <div>
                      <div className="font-display text-lg leading-none">{avgRating}/5</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{reviews.length} reviews</div>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Bio + meta */}
            <Reveal delay={0.1}>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-primary">
                  <Sparkles className="h-3 w-3" /> {member.role}
                </span>
                <h1 className="mt-4 font-display text-5xl md:text-7xl text-gradient-gold leading-[1.02]">
                  {member.name}
                </h1>

                {/* Meta row */}
                <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" /> {profile.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> {profile.joined}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Film className="h-4 w-4 text-primary" /> {profile.highlights[0].value} {profile.highlights[0].label.toLowerCase()}
                  </span>
                </div>

                <p className="mt-6 text-lg text-foreground/85 leading-relaxed">{member.bio}</p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95"
                    >
                      <Mail className="h-4 w-4" /> Send Email
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary/60"
                    >
                      <Phone className="h-4 w-4 text-primary" /> Call now
                    </a>
                  )}
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary/60"
                  >
                    <MessageCircle className="h-4 w-4 text-primary" /> Hire {firstName}
                  </Link>
                </div>

                {/* Socials */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Follow</span>
                  {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground/70 transition hover:border-primary/60 hover:text-primary"
                      aria-label="social"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS STRIP */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.label} delay={i * 0.08}>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-gold">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <h.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-3xl text-gradient-gold leading-none">{h.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{h.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS & JOURNEY */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <Reveal>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary">Specialties</div>
                <h2 className="mt-2 font-display text-3xl md:text-4xl">
                  Crafted in <span className="text-gradient-gold">{firstName}'s</span> toolkit
                </h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {member.skills.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <ul className="mt-6 space-y-3 text-sm text-foreground/85">
                  {[
                    "Cinematic color grading & LUT design",
                    "Beat-mapped motion editing",
                    "Brand storytelling for short-form",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          {/* Journey */}
          <Reveal delay={0.1}>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-primary">Journey</div>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">
                A path through <span className="text-gradient-gold">cinema</span>
              </h2>
              <div className="mt-6 space-y-5 border-l-2 border-border pl-6">
                {JOURNEY.map((j) => (
                  <div key={j.year} className="relative">
                    <div className="absolute -left-[33px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="text-xs uppercase tracking-widest text-primary">{j.year} • {j.org}</div>
                    <div className="mt-1 font-display text-xl">{j.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{j.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary">Client Voices</div>
                <h2 className="mt-2 font-display text-4xl md:text-5xl">
                  What clients say about <span className="text-gradient-gold">{firstName}</span>
                </h2>
              </div>
              {avgRating && (
                <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 md:inline-flex">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{avgRating}/5 average</span>
                </div>
              )}
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.05}>
                <div className="relative h-full rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-gold">
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
                  <div className="flex gap-1">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mt-4 text-foreground/90 leading-relaxed">"{r.comment}"</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-sm font-bold text-primary-foreground">
                      {r.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{r.reviewer_name}</div>
                      <div className="text-xs text-muted-foreground">Verified client</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          <Reveal>
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-primary">FAQ</div>
              <h2 className="mt-2 font-display text-4xl md:text-5xl">
                Ask <span className="text-gradient-gold">{firstName}</span>
              </h2>
              <p className="mt-3 text-muted-foreground">The questions clients ask before kicking off a project.</p>
            </div>
          </Reveal>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <FaqItem key={f.id} q={f.question} a={f.answer} />
            ))}
          </div>
        </section>
      )}

      {/* RELATED MEMBERS */}
      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary">More Crew</div>
                <h2 className="mt-2 font-display text-4xl md:text-5xl">Meet the rest of the team</h2>
              </div>
              <Link to="/team" className="hidden items-center gap-1 text-sm text-primary hover:underline md:inline-flex">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {others.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.08}>
                <Link
                  to="/team/$slug"
                  params={{ slug: o.slug }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50 hover:shadow-gold"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={resolveTeamPhoto(o.photo_url)}
                      alt={o.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-display text-lg">{o.name}</div>
                    <div className="text-xs uppercase tracking-widest text-primary">{o.role}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-secondary to-card p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-spotlight" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl">
              Ready to create with <span className="text-gradient-gold">{firstName}</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Tell us about your project — we'll loop {firstName} in if it's a fit, with a tailored creative direction within 24 hours.
            </p>
            <Link
              to="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95"
            >
              Start a project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border bg-card transition ${open ? "border-primary/40 shadow-gold" : "border-border"}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border p-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}
