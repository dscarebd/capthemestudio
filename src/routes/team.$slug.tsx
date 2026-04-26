import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { resolveTeamPhoto } from "@/lib/team-photos";
import { Mail, Phone, ArrowLeft, Star, ChevronDown, Sparkles, MessageCircle, Award } from "lucide-react";

export const Route = createFileRoute("/team/$slug")({
  loader: async ({ params }) => {
    const { data: member } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle();
    if (!member) throw notFound();
    return { member };
  },
  component: MemberPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl">Member not found</h1>
        <Link to="/team" className="mt-6 inline-flex items-center gap-2 text-primary"><ArrowLeft className="h-4 w-4" /> Back to team</Link>
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

function MemberPage() {
  const { member } = Route.useLoaderData();
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

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-spotlight" />
        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-20">
          <Link to="/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to team
          </Link>
          <div className="mt-8 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-cinematic">
                  <img
                    src={resolveTeamPhoto(member.photo_url)}
                    alt={member.name}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs uppercase tracking-widest text-primary backdrop-blur">
                      <Sparkles className="h-3 w-3" /> {member.role}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-primary">CapThemeStudio Crew</span>
                <h1 className="mt-3 font-display text-5xl md:text-7xl text-gradient-gold leading-[1.05]">
                  {member.name}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">{member.role}</p>

                <p className="mt-6 text-foreground/85 leading-relaxed">{member.bio}</p>

                {/* Quick stats */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="font-display text-2xl text-gradient-gold">{reviews.length}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Reviews</div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="font-display text-2xl text-gradient-gold">{avgRating ?? "—"}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Avg Rating</div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="font-display text-2xl text-gradient-gold">{faqs.length}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Answers</div>
                  </div>
                </div>

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Specialties</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.skills.map((s: string) => (
                        <span
                          key={s}
                          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-widest text-primary"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95"
                    >
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary/60"
                    >
                      <Phone className="h-4 w-4 text-primary" /> Call
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
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
                  What clients say about <span className="text-gradient-gold">{member.name.split(" ")[0]}</span>
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 md:inline-flex">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{avgRating}/5</span>
              </div>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-gold">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {Array.from({ length: r.rating }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-foreground/90 leading-relaxed">"{r.comment}"</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-sm font-bold text-primary-foreground">
                      {r.reviewer_name.charAt(0)}
                    </div>
                    <div className="text-sm font-semibold">{r.reviewer_name}</div>
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
                Ask <span className="text-gradient-gold">{member.name.split(" ")[0]}</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => <FaqItem key={f.id} q={f.question} a={f.answer} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-spotlight" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl">
              Want to work with <span className="text-gradient-gold">{member.name.split(" ")[0]}</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Tell us about your project — we'll loop {member.name.split(" ")[0]} in if it's a fit.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95"
            >
              Start a project
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
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border p-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}
