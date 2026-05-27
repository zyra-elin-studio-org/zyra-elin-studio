import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({ component: Admin });

type Tab = "overview" | "videos" | "images" | "inquiries" | "settings";

function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && !user) {
      void nav({ to: "/login" });
    }
  }, [loading, user, nav]);

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account is not an admin. Signed in as {user.email}.</p>
          <button onClick={async () => { await signOut(); nav({ to: "/login" }); }} className="mt-4 rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-primary-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  const tabs: Array<[Tab, string]> = [["overview","🏠 Overview"],["videos","🎬 Videos"],["images","🖼️ Images"],["inquiries","📩 Inquiries"],["settings","⚙️ Settings"]];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-border bg-card/50 p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient font-display text-sm font-bold text-primary-foreground">ZE</span>
          <span className="font-display">Admin</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${tab === k ? "bg-gold-gradient text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}>{l}</button>
          ))}
        </nav>
        <button onClick={async () => { await signOut(); nav({ to: "/login" }); }} className="mt-4 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">🚪 Logout</button>
      </aside>

      <main className="flex-1 overflow-auto p-6 sm:p-10">
        <div className="md:hidden mb-4 flex gap-2 overflow-x-auto">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${tab === k ? "bg-gold-gradient text-primary-foreground" : "border border-border text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
        {tab === "overview" && <Overview />}
        {tab === "videos" && <Videos />}
        {tab === "images" && <Images />}
        {tab === "inquiries" && <Inquiries />}
        {tab === "settings" && <Settings />}
      </main>
    </div>
  );
}

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [v, i, q, n] = await Promise.all([
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("images").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return { videos: v.count ?? 0, images: i.count ?? 0, inquiries: q.count ?? 0, newInquiries: n.count ?? 0 };
    },
  });
  const items = [["Videos", data?.videos],["Images", data?.images],["Inquiries", data?.inquiries],["New", data?.newInquiries]] as const;
  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([l, n]) => (
          <div key={l} className="glass rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-2 font-display text-4xl font-bold text-gold-gradient">{n ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const cats = ["general", "brand-promo", "product-review", "fashion", "food", "tech"];

async function uploadToBucket(file: File, bucket: "media-videos" | "media-images"): Promise<string | null> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) { toast.error(error.message); return null; }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function Videos() {
  const qc = useQueryClient();
  const { data: videos } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => (await supabase.from("videos").select("*").order("sort_order").order("created_at", { ascending: false })).data ?? [],
  });
  const [form, setForm] = useState({ title_en: "", title_bn: "", video_url: "", thumbnail_url: "", category: "general", featured: false });
  const [upV, setUpV] = useState(false);
  const [upT, setUpT] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_en || !form.video_url) { toast.error("Title & video (URL or upload) required"); return; }
    const { error } = await supabase.from("videos").insert(form);
    if (error) toast.error(error.message); else { toast.success("Added"); setForm({ title_en: "", title_bn: "", video_url: "", thumbnail_url: "", category: "general", featured: false }); qc.invalidateQueries({ queryKey: ["admin-videos"] }); qc.invalidateQueries({ queryKey: ["videos"] }); }
  }
  async function del(id: string) {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) toast.error(error.message); else { qc.invalidateQueries({ queryKey: ["admin-videos"] }); qc.invalidateQueries({ queryKey: ["videos"] }); }
  }

  const input = "rounded-lg border border-border bg-background/50 px-3 py-2 text-sm";
  return (
    <div>
      <h1 className="font-display text-3xl">Videos</h1>
      <form onSubmit={add} className="glass mt-6 grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
        <input className={input} placeholder="Title (EN) *" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <input className={input} placeholder="Title (BN)" value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
        <input className={input + " sm:col-span-2"} placeholder="Video URL (YouTube, Facebook page video, or direct) *" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
        <label className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
          <span>…or upload from PC:</span>
          <input type="file" accept="video/*" disabled={upV} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setUpV(true);
            const url = await uploadToBucket(f, "media-videos");
            setUpV(false);
            if (url) { setForm((p) => ({ ...p, video_url: url })); toast.success("Video uploaded"); }
            e.target.value = "";
          }} className="text-xs" />
          {upV && <span className="text-gold">Uploading…</span>}
        </label>
        <input className={input + " sm:col-span-2"} placeholder="Thumbnail URL" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} />
        <label className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
          <span>…or upload thumbnail:</span>
          <input type="file" accept="image/*" disabled={upT} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setUpT(true);
            const url = await uploadToBucket(f, "media-images");
            setUpT(false);
            if (url) { setForm((p) => ({ ...p, thumbnail_url: url })); toast.success("Thumbnail uploaded"); }
            e.target.value = "";
          }} className="text-xs" />
          {upT && <span className="text-gold">Uploading…</span>}
        </label>
        <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <button className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground sm:col-span-2">Add video</button>
      </form>
      <div className="mt-6 space-y-2">
        {videos?.map((v) => (
          <div key={v.id} className="glass flex items-center justify-between rounded-xl p-4">
            <div><div className="font-medium">{v.title_en}</div><div className="text-xs text-muted-foreground">{v.category}</div></div>
            <button onClick={() => del(v.id)} className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button>
          </div>
        ))}
        {!videos?.length && <div className="text-sm text-muted-foreground">No videos yet.</div>}
      </div>
    </div>
  );
}

function Images() {
  const qc = useQueryClient();
  const { data: images } = useQuery({ queryKey: ["admin-images"], queryFn: async () => (await supabase.from("images").select("*").order("sort_order").order("created_at", { ascending: false })).data ?? [] });
  const [form, setForm] = useState({ title_en: "", title_bn: "", image_url: "", category: "general" });
  const [upI, setUpI] = useState(false);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_en || !form.image_url) { toast.error("Title & image (URL or upload) required"); return; }
    const { error } = await supabase.from("images").insert(form);
    if (error) toast.error(error.message); else { toast.success("Added"); setForm({ title_en: "", title_bn: "", image_url: "", category: "general" }); qc.invalidateQueries({ queryKey: ["admin-images"] }); }
  }
  async function del(id: string) {
    if (!confirm("Delete this image?")) return;
    await supabase.from("images").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-images"] });
  }
  const input = "rounded-lg border border-border bg-background/50 px-3 py-2 text-sm";
  return (
    <div>
      <h1 className="font-display text-3xl">Images</h1>
      <form onSubmit={add} className="glass mt-6 grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
        <input className={input} placeholder="Title (EN) *" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <input className={input} placeholder="Title (BN)" value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
        <input className={input + " sm:col-span-2"} placeholder="Image URL *" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <label className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
          <span>…or upload from PC:</span>
          <input type="file" accept="image/*" disabled={upI} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setUpI(true);
            const url = await uploadToBucket(f, "media-images");
            setUpI(false);
            if (url) { setForm((p) => ({ ...p, image_url: url })); toast.success("Image uploaded"); }
            e.target.value = "";
          }} className="text-xs" />
          {upI && <span className="text-gold">Uploading…</span>}
        </label>
        <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground sm:col-span-2">Add image</button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images?.map((im) => (
          <div key={im.id} className="glass overflow-hidden rounded-xl">
            <img src={im.image_url} alt={im.title_en} className="aspect-square w-full object-cover" />
            <div className="flex items-center justify-between p-3 text-xs">
              <span className="truncate">{im.title_en}</span>
              <button onClick={() => del(im.id)} className="text-destructive">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Inquiries() {
  const qc = useQueryClient();
  const { data: items } = useQuery({ queryKey: ["admin-inq"], queryFn: async () => (await supabase.from("inquiries").select("*").order("created_at", { ascending: false })).data ?? [] });
  async function setStatus(id: string, status: string) {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-inq"] });
  }
  return (
    <div>
      <h1 className="font-display text-3xl">Inquiries</h1>
      <div className="mt-6 space-y-3">
        {items?.map((q) => (
          <div key={q.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium">{q.name} <span className="ml-2 text-xs text-muted-foreground">{q.email}</span></div>
                <div className="text-xs text-muted-foreground">{q.brand_name} · {q.service_type} · {q.budget_range}</div>
              </div>
              <select value={q.status} onChange={(e) => setStatus(q.id, e.target.value)} className="rounded-md border border-border bg-background/50 px-2 py-1 text-xs">
                <option value="new">new</option><option value="read">read</option><option value="replied">replied</option>
              </select>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{q.message}</p>
            <div className="mt-2 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</div>
          </div>
        ))}
        {!items?.length && <div className="text-sm text-muted-foreground">No inquiries yet.</div>}
      </div>
    </div>
  );
}

function Settings() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({ queryKey: ["admin-settings"], queryFn: async () => (await supabase.from("site_settings").select("*")).data ?? [] });
  const [vals, setVals] = useState<Record<string, string>>({});
  const merged: Record<string, string> = { ...Object.fromEntries((rows ?? []).map((r) => [r.key, r.value])), ...vals };
  async function save(key: string) {
    const value = merged[key] ?? "";
    const { error } = await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    if (error) toast.error(error.message); else { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-settings"] }); qc.invalidateQueries({ queryKey: ["site_settings"] }); }
  }
  const fields: Array<[string, string]> = [["whatsapp", "WhatsApp number"], ["facebook", "Facebook URL"], ["email", "Email"], ["facebook_page", "Facebook page name"]];
  return (
    <div>
      <h1 className="font-display text-3xl">Settings</h1>
      <div className="mt-6 space-y-3">
        {fields.map(([k, l]) => (
          <div key={k} className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
            <label className="w-40 text-sm text-muted-foreground">{l}</label>
            <input className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm" value={merged[k] ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
            <button onClick={() => save(k)} className="rounded-lg bg-gold-gradient px-4 py-2 text-xs font-semibold text-primary-foreground">Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}
