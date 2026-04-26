import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { resolveTeamPhoto } from "@/lib/team-photos";
import { Mail, Phone, ArrowLeft, Star, ChevronDown } from "lucide-react";

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

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Link to="/team" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to team
        </Link>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border/40 shadow-cinematic">
              <img src={resolveTeamPhoto(member.photo_url)} alt={member.name} className="aspect-[4/5] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <span className="text-xs uppercase tracking-widest text-primary">{member.role}</span>
              <h1 className="mt-2 font-display text-5xl md:text-6xl text-gradient-gold">{member.name}</h1>
              <p className="mt-5 text-foreground/85 leading-relaxed">{member.bio}</p>

              {member.skills && member.skills.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {member.skills.map((s: string) => (
                    <span key={s} className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs uppercase tracking-widest text-foreground/80">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 space-y-2 text-sm">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-foreground/90 hover:text-primary">
                    <Mail className="h-4 w-4 text-primary" /> {member.email}
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-foreground/90 hover:text-primary">
                    <Phone className="h-4 w-4 text-primary" /> {member.phone}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl">Reviews for {member.name.split(" ")[0]}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border/50 bg-card/40 p-6">
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90">"{r.comment}"</p>
                <div className="mt-3 text-sm font-semibold">{r.reviewer_name}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-center">Ask {member.name.split(" ")[0]}</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => <FaqItem key={f.id} q={f.question} a={f.answer} />)}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 bg-card/40">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border/40 p-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}
