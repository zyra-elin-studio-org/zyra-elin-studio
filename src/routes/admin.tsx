import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { listUsers, setUserRole, deleteUser, inviteUser } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({ component: Admin });

type Tab = "overview" | "videos" | "images" | "inquiries" | "users" | "settings";

function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!loading && !user) void nav({ to: "/login" });
  }, [loading, user, nav]);

  if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email}.</p>
          <button onClick={async () => { await signOut(); nav({ to: "/login" }); }} className="mt-4 rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-primary-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  const tabs: Array<[Tab, string]> = [
    ["overview", "🏠 Overview"],
    ["videos", "🎬 Videos"],
    ["images", "🖼️ Images"],
    ["inquiries", "📩 Inquiries"],
    ["users", "👥 Users"],
    ["settings", "⚙️ Settings"],
  ];

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
        <div className="mt-4 truncate rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground" title={user.email ?? ""}>{user.email}</div>
        <button onClick={async () => { await signOut(); nav({ to: "/login" }); }} className="mt-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">🚪 Logout</button>
      </aside>

      <main className="flex-1 overflow-auto p-6 sm:p-10">
        <div className="md:hidden mb-4 flex gap-2 overflow-x-auto">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${tab === k ? "bg-gold-gradient text-primary-foreground" : "border border-border text-muted-foreground"}`}>{l}</button>
          ))}
        </div>
        {tab === "overview" && <Overview onJump={setTab} />}
        {tab === "videos" && <Videos />}
        {tab === "images" && <Images />}
        {tab === "inquiries" && <Inquiries />}
        {tab === "users" && <Users />}
        {tab === "settings" && <Settings />}
      </main>
    </div>
  );
}

const input = "rounded-lg border border-border bg-background/50 px-3 py-2 text-sm";
const cats = ["general", "brand-promo", "product-review", "fashion", "food", "tech"];

async function uploadToBucket(file: File, bucket: "media-videos" | "media-images"): Promise<string | null> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) { toast.error(error.message); return null; }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function Overview({ onJump }: { onJump: (t: Tab) => void }) {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [v, i, q, n, recent] = await Promise.all([
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("images").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("inquiries").select("id,name,email,message,created_at,status").order("created_at", { ascending: false }).limit(5),
      ]);
      return { videos: v.count ?? 0, images: i.count ?? 0, inquiries: q.count ?? 0, newInquiries: n.count ?? 0, recent: recent.data ?? [] };
    },
  });
  const items = [
    ["Videos", data?.videos, "videos"],
    ["Images", data?.images, "images"],
    ["Inquiries", data?.inquiries, "inquiries"],
    ["New", data?.newInquiries, "inquiries"],
  ] as const;
  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([l, n, t]) => (
          <button key={l} onClick={() => onJump(t as Tab)} className="glass rounded-2xl p-6 text-left transition hover:scale-[1.02]">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
            <div className="mt-2 font-display text-4xl font-bold text-gold-gradient">{n ?? "—"}</div>
          </button>
        ))}
      </div>
      <div className="glass mt-8 rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Recent inquiries</h2>
          <button onClick={() => onJump("inquiries")} className="text-xs text-gold hover:underline">View all →</button>
        </div>
        <div className="divide-y divide-border">
          {data?.recent?.length ? data.recent.map((q) => (
            <div key={q.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{q.name} <span className="ml-1 text-xs text-muted-foreground">{q.email}</span></div>
                  <div className="truncate text-xs text-muted-foreground">{q.message}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${q.status === "new" ? "bg-gold/20 text-gold" : "border border-border text-muted-foreground"}`}>{q.status}</span>
              </div>
            </div>
          )) : <div className="text-sm text-muted-foreground">No inquiries yet.</div>}
        </div>
      </div>
    </div>
  );
}

type VideoRow = { id: string; title_en: string; title_bn: string | null; video_url: string; thumbnail_url: string | null; category: string; featured: boolean; sort_order: number };

function Videos() {
  const qc = useQueryClient();
  const { data: videos } = useQuery<VideoRow[]>({
    queryKey: ["admin-videos"],
    queryFn: async () => (await supabase.from("videos").select("*").order("sort_order").order("created_at", { ascending: false })).data ?? [],
  });
  const [form, setForm] = useState({ title_en: "", title_bn: "", video_url: "", thumbnail_url: "", category: "general", featured: false });
  const [upV, setUpV] = useState(false);
  const [upT, setUpT] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<VideoRow | null>(null);

  const filtered = useMemo(() => (videos ?? []).filter((v) => v.title_en.toLowerCase().includes(search.toLowerCase()) || v.category.includes(search.toLowerCase())), [videos, search]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_en || !form.video_url) { toast.error("Title & video required"); return; }
    const { error } = await supabase.from("videos").insert(form);
    if (error) toast.error(error.message);
    else { toast.success("Added"); setForm({ title_en: "", title_bn: "", video_url: "", thumbnail_url: "", category: "general", featured: false }); refresh(); }
  }
  function refresh() { qc.invalidateQueries({ queryKey: ["admin-videos"] }); qc.invalidateQueries({ queryKey: ["videos"] }); }
  async function del(id: string) {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) toast.error(error.message); else refresh();
  }
  async function toggleFeatured(v: VideoRow) {
    await supabase.from("videos").update({ featured: !v.featured }).eq("id", v.id);
    refresh();
  }
  async function move(v: VideoRow, dir: -1 | 1) {
    const list = videos ?? [];
    const idx = list.findIndex((x) => x.id === v.id);
    const swap = list[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("videos").update({ sort_order: swap.sort_order }).eq("id", v.id),
      supabase.from("videos").update({ sort_order: v.sort_order }).eq("id", swap.id),
    ]);
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Videos</h1>
        <input className={input} placeholder="🔍 Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <form onSubmit={add} className="glass mt-6 grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
        <input className={input} placeholder="Title (EN) *" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <input className={input} placeholder="Title (BN)" value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
        <input className={input + " sm:col-span-2"} placeholder="Video URL (YouTube, Facebook, or direct) *" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
        <label className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
          <span>…or upload from PC:</span>
          <input type="file" accept="video/*" disabled={upV} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setUpV(true); const url = await uploadToBucket(f, "media-videos"); setUpV(false);
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
            setUpT(true); const url = await uploadToBucket(f, "media-images"); setUpT(false);
            if (url) { setForm((p) => ({ ...p, thumbnail_url: url })); toast.success("Thumbnail uploaded"); }
            e.target.value = "";
          }} className="text-xs" />
          {upT && <span className="text-gold">Uploading…</span>}
        </label>
        <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <button className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground sm:col-span-2">+ Add video</button>
      </form>

      <div className="mt-6 space-y-2">
        {filtered.map((v, i) => (
          <div key={v.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{v.title_en}</span>
                {v.featured && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] text-gold">FEATURED</span>}
              </div>
              <div className="text-xs text-muted-foreground">{v.category} · #{v.sort_order}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => move(v, -1)} disabled={i === 0} className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-30">▲</button>
              <button onClick={() => move(v, 1)} disabled={i === filtered.length - 1} className="rounded-md border border-border px-2 py-1 text-xs disabled:opacity-30">▼</button>
              <button onClick={() => toggleFeatured(v)} className="rounded-md border border-border px-2 py-1 text-xs">{v.featured ? "Unstar" : "★"}</button>
              <button onClick={() => setEditing(v)} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-secondary/60">Edit</button>
              <button onClick={() => del(v.id)} className="rounded-md border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button>
            </div>
          </div>
        ))}
        {!filtered.length && <div className="text-sm text-muted-foreground">No videos.</div>}
      </div>

      {editing && (
        <EditModal title="Edit video" onClose={() => setEditing(null)} onSave={async (patch) => {
          const { error } = await supabase.from("videos").update(patch as never).eq("id", editing.id);
          if (error) toast.error(error.message); else { toast.success("Updated"); setEditing(null); refresh(); }
        }} fields={[
          ["title_en", "Title (EN)", editing.title_en],
          ["title_bn", "Title (BN)", editing.title_bn ?? ""],
          ["video_url", "Video URL", editing.video_url],
          ["thumbnail_url", "Thumbnail URL", editing.thumbnail_url ?? ""],
          ["category", "Category", editing.category],
        ]} />
      )}
    </div>
  );
}

type ImageRow = { id: string; title_en: string; title_bn: string | null; image_url: string; category: string; sort_order: number };

function Images() {
  const qc = useQueryClient();
  const { data: images } = useQuery<ImageRow[]>({ queryKey: ["admin-images"], queryFn: async () => (await supabase.from("images").select("*").order("sort_order").order("created_at", { ascending: false })).data ?? [] });
  const [form, setForm] = useState({ title_en: "", title_bn: "", image_url: "", category: "general" });
  const [upI, setUpI] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ImageRow | null>(null);

  const filtered = useMemo(() => (images ?? []).filter((v) => v.title_en.toLowerCase().includes(search.toLowerCase()) || v.category.includes(search.toLowerCase())), [images, search]);

  function refresh() { qc.invalidateQueries({ queryKey: ["admin-images"] }); qc.invalidateQueries({ queryKey: ["images"] }); }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title_en || !form.image_url) { toast.error("Title & image required"); return; }
    const { error } = await supabase.from("images").insert(form);
    if (error) toast.error(error.message); else { toast.success("Added"); setForm({ title_en: "", title_bn: "", image_url: "", category: "general" }); refresh(); }
  }
  async function del(id: string) {
    if (!confirm("Delete this image?")) return;
    await supabase.from("images").delete().eq("id", id); refresh();
  }
  async function move(v: ImageRow, dir: -1 | 1) {
    const list = images ?? []; const idx = list.findIndex((x) => x.id === v.id);
    const swap = list[idx + dir]; if (!swap) return;
    await Promise.all([
      supabase.from("images").update({ sort_order: swap.sort_order }).eq("id", v.id),
      supabase.from("images").update({ sort_order: v.sort_order }).eq("id", swap.id),
    ]); refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Images</h1>
        <input className={input} placeholder="🔍 Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <form onSubmit={add} className="glass mt-6 grid gap-3 rounded-2xl p-5 sm:grid-cols-2">
        <input className={input} placeholder="Title (EN) *" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <input className={input} placeholder="Title (BN)" value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
        <input className={input + " sm:col-span-2"} placeholder="Image URL *" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <label className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
          <span>…or upload from PC:</span>
          <input type="file" accept="image/*" disabled={upI} onChange={async (e) => {
            const f = e.target.files?.[0]; if (!f) return;
            setUpI(true); const url = await uploadToBucket(f, "media-images"); setUpI(false);
            if (url) { setForm((p) => ({ ...p, image_url: url })); toast.success("Image uploaded"); }
            e.target.value = "";
          }} className="text-xs" />
          {upI && <span className="text-gold">Uploading…</span>}
        </label>
        <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground sm:col-span-2">+ Add image</button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((im, i) => (
          <div key={im.id} className="glass overflow-hidden rounded-xl">
            <img src={im.image_url} alt={im.title_en} className="aspect-square w-full object-cover" />
            <div className="space-y-2 p-3 text-xs">
              <div className="truncate font-medium">{im.title_en}</div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button onClick={() => move(im, -1)} disabled={i === 0} className="rounded border border-border px-1.5 disabled:opacity-30">▲</button>
                  <button onClick={() => move(im, 1)} disabled={i === filtered.length - 1} className="rounded border border-border px-1.5 disabled:opacity-30">▼</button>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(im)} className="rounded border border-border px-2">Edit</button>
                  <button onClick={() => del(im.id)} className="text-destructive">✕</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EditModal title="Edit image" onClose={() => setEditing(null)} onSave={async (patch) => {
          const { error } = await supabase.from("images").update(patch as never).eq("id", editing.id);
          if (error) toast.error(error.message); else { toast.success("Updated"); setEditing(null); refresh(); }
        }} fields={[
          ["title_en", "Title (EN)", editing.title_en],
          ["title_bn", "Title (BN)", editing.title_bn ?? ""],
          ["image_url", "Image URL", editing.image_url],
          ["category", "Category", editing.category],
        ]} />
      )}
    </div>
  );
}

function Inquiries() {
  const qc = useQueryClient();
  const { data: items } = useQuery({ queryKey: ["admin-inq"], queryFn: async () => (await supabase.from("inquiries").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => (items ?? []).filter((q) => {
    if (status !== "all" && q.status !== status) return false;
    const s = search.toLowerCase();
    return !s || q.name.toLowerCase().includes(s) || q.email.toLowerCase().includes(s) || q.message.toLowerCase().includes(s);
  }), [items, search, status]);

  async function setS(id: string, s: string) { await supabase.from("inquiries").update({ status: s }).eq("id", id); qc.invalidateQueries({ queryKey: ["admin-inq"] }); }
  async function del(id: string) { if (!confirm("Delete?")) return; await supabase.from("inquiries").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-inq"] }); }

  function exportCsv() {
    const rows = filtered;
    const headers = ["name", "email", "phone", "brand_name", "service_type", "budget_range", "status", "message", "created_at"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape((r as Record<string, unknown>)[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `inquiries-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Inquiries</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input className={input} placeholder="🔍 Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={input} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All status</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
          </select>
          <button onClick={exportCsv} className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-secondary/60">⬇ Export CSV</button>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {filtered.map((q) => (
          <div key={q.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium">{q.name} <span className="ml-2 text-xs text-muted-foreground">{q.email}</span></div>
                <div className="text-xs text-muted-foreground">{q.brand_name} · {q.service_type} · {q.budget_range} {q.phone && `· ${q.phone}`}</div>
              </div>
              <div className="flex items-center gap-2">
                <select value={q.status} onChange={(e) => setS(q.id, e.target.value)} className="rounded-md border border-border bg-background/50 px-2 py-1 text-xs">
                  <option value="new">new</option><option value="read">read</option><option value="replied">replied</option>
                </select>
                <a href={`mailto:${q.email}?subject=Re: Your inquiry`} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary/60">✉ Reply</a>
                <button onClick={() => del(q.id)} className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{q.message}</p>
            <div className="mt-2 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</div>
          </div>
        ))}
        {!filtered.length && <div className="text-sm text-muted-foreground">No inquiries match.</div>}
      </div>
    </div>
  );
}

function Users() {
  const qc = useQueryClient();
  const listFn = useServerFn(listUsers);
  const setRoleFn = useServerFn(setUserRole);
  const delFn = useServerFn(deleteUser);
  const inviteFn = useServerFn(inviteUser);
  const { data, isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [search, setSearch] = useState("");

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try { await inviteFn({ data: { email, role } }); toast.success("Invite sent"); setEmail(""); qc.invalidateQueries({ queryKey: ["admin-users"] }); }
    catch (err) { toast.error((err as Error).message); }
  }
  async function changeRole(id: string, r: "admin" | "viewer") {
    try { await setRoleFn({ data: { userId: id, role: r } }); toast.success("Role updated"); qc.invalidateQueries({ queryKey: ["admin-users"] }); }
    catch (err) { toast.error((err as Error).message); }
  }
  async function remove(id: string, em: string) {
    if (!confirm(`Delete user ${em}? This cannot be undone.`)) return;
    try { await delFn({ data: { userId: id } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-users"] }); }
    catch (err) { toast.error((err as Error).message); }
  }

  const users = (data?.users ?? []).filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="font-display text-3xl">Users</h1>

      <form onSubmit={invite} className="glass mt-6 flex flex-wrap items-end gap-3 rounded-2xl p-5">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-muted-foreground">Invite by email</label>
          <input className={input + " w-full"} type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground">Role</label>
          <select className={input} value={role} onChange={(e) => setRole(e.target.value as "admin" | "viewer")}>
            <option value="viewer">viewer</option><option value="admin">admin</option>
          </select>
        </div>
        <button className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground">Send invite</button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <input className={input} placeholder="🔍 Search email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="text-xs text-muted-foreground">{users.length} user{users.length === 1 ? "" : "s"}</div>
      </div>

      <div className="glass mt-3 overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Last sign in</th><th className="p-3">Created</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="p-4 text-muted-foreground">Loading…</td></tr>}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50">
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value as "admin" | "viewer")} className="rounded-md border border-border bg-background/50 px-2 py-1 text-xs">
                    <option value="viewer">viewer</option><option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right"><button onClick={() => remove(u.id, u.email)} className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10">Delete</button></td>
              </tr>
            ))}
            {!isLoading && !users.length && <tr><td colSpan={5} className="p-4 text-muted-foreground">No users.</td></tr>}
          </tbody>
        </table>
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

  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [busy, setBusy] = useState(false);
  async function changePw(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Minimum 8 characters");
    if (pw !== pw2) return toast.error("Passwords don't match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Password updated"); setPw(""); setPw2(""); }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Settings</h1>

      <h2 className="mt-6 mb-3 font-display text-lg text-muted-foreground">Contact info</h2>
      <div className="space-y-3">
        {fields.map(([k, l]) => (
          <div key={k} className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
            <label className="w-40 text-sm text-muted-foreground">{l}</label>
            <input className="flex-1 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm" value={merged[k] ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
            <button onClick={() => save(k)} className="rounded-lg bg-gold-gradient px-4 py-2 text-xs font-semibold text-primary-foreground">Save</button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-3 font-display text-lg text-muted-foreground">Change my password</h2>
      <form onSubmit={changePw} className="glass flex flex-wrap items-end gap-3 rounded-2xl p-5">
        <div className="flex-1 min-w-[180px]"><label className="block text-xs text-muted-foreground">New password</label><input type="password" className={input + " w-full"} value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div className="flex-1 min-w-[180px]"><label className="block text-xs text-muted-foreground">Confirm</label><input type="password" className={input + " w-full"} value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        <button disabled={busy} className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Update password"}</button>
      </form>
    </div>
  );
}

function EditModal({ title, fields, onClose, onSave }: { title: string; fields: Array<[string, string, string]>; onClose: () => void; onSave: (patch: Record<string, string>) => void | Promise<void>; }) {
  const [state, setState] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(([k, , v]) => [k, v])));
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="glass w-full max-w-lg rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h3 className="font-display text-xl">{title}</h3><button onClick={onClose} className="text-muted-foreground">✕</button></div>
        <div className="mt-4 space-y-3">
          {fields.map(([k, label]) => (
            <div key={k}><label className="block text-xs text-muted-foreground">{label}</label><input className={input + " w-full"} value={state[k] ?? ""} onChange={(e) => setState({ ...state, [k]: e.target.value })} /></div>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={() => onSave(state)} className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}
