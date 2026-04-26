import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import ogImage from "@/assets/og-cover.jpg";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Start a Project | CapThemeStudio" },
      { name: "description", content: "Tell us about your project. We reply within 24 hours with a tailored cinematic creative direction." },
      { property: "og:title", content: "Contact — CapThemeStudio" },
      { property: "og:description", content: "Start your cinematic CapCut project today." },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErr("");
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: form.subject || null,
      message: form.message,
    });
    if (error) {
      setStatus("error");
      setErr(error.message);
    } else {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <span className="text-xs uppercase tracking-widest text-primary">Get in Touch</span>
            <h1 className="mt-3 font-display text-5xl md:text-7xl">Let's make something <span className="text-gradient-gold">cinematic</span>.</h1>
            <p className="mt-5 max-w-md text-muted-foreground">Whether you're launching a brand or scaling content — we'll respond within 24 hours with a creative direction.</p>

            <div className="mt-10 space-y-4 text-sm">
              <a href="mailto:hello@capthemestudio.xyz" className="flex items-center gap-3 text-foreground/90 hover:text-primary">
                <span className="rounded-full bg-primary/10 p-2"><Mail className="h-4 w-4 text-primary" /></span>
                hello@capthemestudio.xyz
              </a>
              <a href="tel:+14155550100" className="flex items-center gap-3 text-foreground/90 hover:text-primary">
                <span className="rounded-full bg-primary/10 p-2"><Phone className="h-4 w-4 text-primary" /></span>
                +1 (415) 555-0100
              </a>
              <div className="flex items-center gap-3 text-foreground/90">
                <span className="rounded-full bg-primary/10 p-2"><MapPin className="h-4 w-4 text-primary" /></span>
                Worldwide • Remote-first studio
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} className="rounded-3xl border border-border/50 bg-card/40 p-8 shadow-cinematic">
              {status === "success" ? (
                <div className="flex flex-col items-center text-center py-10">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                  <h3 className="mt-4 font-display text-2xl">Message received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                  <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-primary hover:underline">Send another</button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  </div>
                  <div className="mt-4">
                    <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
                  </div>
                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="mt-2 w-full rounded-md border border-border/60 bg-background/60 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
                  <button
                    disabled={status === "loading"}
                    className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-md bg-gradient-to-r from-primary to-primary-glow px-6 py-3 font-semibold text-primary-foreground shadow-glow-gold hover:opacity-95 transition disabled:opacity-50"
                  >
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send Message
                  </button>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-md border border-border/60 bg-background/60 px-4 py-3 text-sm focus:border-primary focus:outline-none"
      />
    </div>
  );
}
