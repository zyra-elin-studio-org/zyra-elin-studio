import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  brand_name: z.string().trim().max(200).optional().or(z.literal("")),
  service_type: z.string().max(100).optional().or(z.literal("")),
  budget_range: z.string().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(5000),
});

const services = ["Brand Promotion", "Product Review", "Content Creation", "Tech Review", "Fashion Content", "Food Review", "Other"];
const budgets = ["৳5,000 — 10,000", "৳10,000 — 25,000", "৳25,000 — 50,000", "৳50,000+"];

export function ContactForm() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", brand_name: "", service_type: "", budget_range: "", message: "" });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please fill the form correctly");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error(t.contact.form.error); return; }
    toast.success(t.contact.form.success);
    setForm({ name: "", email: "", phone: "", brand_name: "", service_type: "", budget_range: "", message: "" });
  }

  const input = "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-gold/60 focus:ring-1 focus:ring-gold/30";

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={input} placeholder={t.contact.form.name + " *"} value={form.name} onChange={update("name")} required />
        <input className={input} type="email" placeholder={t.contact.form.email + " *"} value={form.email} onChange={update("email")} required />
        <input className={input} placeholder={t.contact.form.phone} value={form.phone} onChange={update("phone")} />
        <input className={input} placeholder={t.contact.form.brand} value={form.brand_name} onChange={update("brand_name")} />
        <select className={input} value={form.service_type} onChange={update("service_type")}>
          <option value="">{t.contact.form.service}</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className={input} value={form.budget_range} onChange={update("budget_range")}>
          <option value="">{t.contact.form.budget}</option>
          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <textarea className={input + " mt-4 min-h-32"} placeholder={t.contact.form.message + " *"} value={form.message} onChange={update("message")} required />
      <button disabled={loading} className="mt-5 w-full rounded-lg bg-gold-gradient px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50" style={{ boxShadow: "var(--shadow-gold)" }}>
        {loading ? t.contact.form.sending : t.contact.form.submit}
      </button>
    </form>
  );
}
