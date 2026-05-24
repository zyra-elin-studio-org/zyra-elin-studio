import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "signin" ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(mode === "signin" ? "Welcome back" : "Account created — signing you in");
    nav({ to: "/admin" });
  }

  const input = "w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30";
  return (
    <div className="grid min-h-screen place-items-center px-6" style={{ background: "var(--gradient-hero)" }}>
      <div className="orb h-80 w-80 bg-gold/30" style={{ top: "15%", right: "10%" }} />
      <form onSubmit={submit} className="glass-strong relative z-10 w-full max-w-md rounded-2xl p-8">
        <div className="mb-6 flex flex-col items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient font-display text-xl font-bold text-primary-foreground" style={{ boxShadow: "var(--shadow-gold)" }}>ZE</span>
          <h1 className="mt-4 font-display text-2xl font-semibold">{mode === "signin" ? "Admin Login" : "Create Admin Account"}</h1>
          <p className="mt-1 text-xs text-muted-foreground">Zyra Elin Studio</p>
        </div>
        <div className="space-y-3">
          <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <button disabled={loading} className="mt-5 w-full rounded-lg bg-gold-gradient px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50" style={{ boxShadow: "var(--shadow-gold)" }}>
          {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-gold">
          {mode === "signin" ? "First time? Create account" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
      </form>
    </div>
  );
}
