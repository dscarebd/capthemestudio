import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { resolveTeamPhoto } from "@/lib/team-photos";
import { Pencil, Save, X, Plus, Trash2, Loader2, Upload, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Admin | CapThemeStudio" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Member = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  location: string | null;
  skills: string[] | null;
  display_order: number;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function Admin() {
  const qc = useQueryClient();
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").order("display_order");
      return (data ?? []) as Member[];
    },
  });

  const [editing, setEditing] = useState<Member | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startNew = () => {
    setCreating(true);
    setEditing({
      id: "",
      name: "",
      slug: "",
      role: "",
      bio: "",
      email: "",
      phone: "",
      photo_url: "",
      location: "",
      skills: [],
      display_order: members.length + 1,
    });
  };

  const uploadPhoto = async (file: File) => {
    if (!editing) return;
    setError("");
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `members/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("team-photos")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (upErr) {
      setUploading(false);
      setError(upErr.message);
      return;
    }
    const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
    setEditing({ ...editing, photo_url: data.publicUrl });
    setUploading(false);
  };

  const save = async () => {
    if (!editing) return;
    setError("");
    setSaving(true);
    const slug = slugify(editing.name);
    const payload = {
      name: editing.name,
      slug,
      role: editing.role,
      bio: editing.bio,
      email: editing.email,
      phone: editing.phone,
      photo_url: editing.photo_url,
      location: editing.location,
      skills: editing.skills,
      display_order: editing.display_order,
    };
    let result;
    if (creating) {
      result = await supabase.from("team_members").insert(payload);
    } else {
      result = await supabase.from("team_members").update(payload).eq("id", editing.id);
    }
    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setEditing(null);
    setCreating(false);
    qc.invalidateQueries({ queryKey: ["admin-team"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) alert(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-team"] });
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary">Admin Panel</span>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Manage <span className="text-gradient-gold">team</span></h1>
            <p className="mt-2 text-sm text-muted-foreground">Edit name, role, bio, contact details. URL slug auto-updates from name.</p>
          </div>
          <button onClick={startNew} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </div>

        {isLoading ? (
          <div className="mt-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="mt-10 space-y-4">
            {members.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border/50 bg-card/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={resolveTeamPhoto(m.photo_url)}
                      alt={m.name}
                      className="h-16 w-16 rounded-lg object-cover border border-border/50"
                    />
                    <div>
                      <div className="font-display text-xl">{m.name}</div>
                      <div className="text-xs text-primary uppercase tracking-widest">{m.role}</div>
                      <div className="mt-1 text-xs text-muted-foreground">/team/{m.slug}</div>
                      {m.email && <div className="mt-1 text-xs text-muted-foreground">{m.email}{m.phone ? ` · ${m.phone}` : ""}</div>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(m); setCreating(false); }} className="rounded-md border border-border/60 p-2 hover:border-primary"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(m.id)} className="rounded-md border border-border/60 p-2 hover:border-destructive text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur p-4 overflow-auto">
            <div className="my-auto w-full max-w-2xl rounded-2xl border border-border/60 bg-card p-6 shadow-cinematic">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">{creating ? "Add" : "Edit"} member</h2>
                <button onClick={() => { setEditing(null); setCreating(false); }} className="rounded-md p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
              </div>

              {/* Photo uploader */}
              <div className="mt-5 flex items-center gap-4 rounded-xl border border-border/60 bg-background/50 p-4">
                {editing.photo_url ? (
                  <img
                    src={resolveTeamPhoto(editing.photo_url)}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover border border-border/50"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium">Profile photo</div>
                  <div className="text-xs text-muted-foreground">PNG / JPG / WEBP — up to 5MB</div>
                  <div className="mt-2 flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadPhoto(f);
                        e.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-1.5 text-xs hover:border-primary disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {uploading ? "Uploading..." : "Upload photo"}
                    </button>
                    {editing.photo_url && (
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, photo_url: "" })}
                        className="inline-flex items-center gap-1 rounded-md border border-border/60 px-3 py-1.5 text-xs text-destructive hover:border-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
                <Input label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />
                <Input label="Email" value={editing.email ?? ""} onChange={(v) => setEditing({ ...editing, email: v })} />
                <Input label="Phone" value={editing.phone ?? ""} onChange={(v) => setEditing({ ...editing, phone: v })} />
                <div className="md:col-span-2">
                  <Input label="Address / Location" value={editing.location ?? ""} onChange={(v) => setEditing({ ...editing, location: v })} />
                </div>
                <Input label="Photo URL (optional)" value={editing.photo_url ?? ""} onChange={(v) => setEditing({ ...editing, photo_url: v })} />
                <Input label="Display order" value={String(editing.display_order)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) || 0 })} />
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Skills (comma separated)</label>
                  <input
                    value={editing.skills?.join(", ") ?? ""}
                    onChange={(e) => setEditing({ ...editing, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                    className="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Bio</label>
                  <textarea
                    rows={4}
                    value={editing.bio ?? ""}
                    onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                    className="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 text-xs text-muted-foreground">URL will be: <span className="text-primary">/team/{slugify(editing.name) || "—"}</span></div>
              </div>
              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => { setEditing(null); setCreating(false); }} className="rounded-md border border-border/60 px-4 py-2 text-sm">Cancel</button>
                <button disabled={saving || !editing.name || !editing.role} onClick={save} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
    </div>
  );
}
