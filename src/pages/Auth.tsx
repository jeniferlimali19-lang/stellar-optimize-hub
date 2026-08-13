import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import GalaxyCanvas from "@/components/GalaxyCanvas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function safeNext(raw: string | null): string {
  if (!raw) return "/panel";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/panel";
  return raw;
}

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(next, { replace: true });
    });
  }, [navigate, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${next}` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Conta criada! Confirme seu e-mail para entrar.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate(next, { replace: true });
  };

  const google = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${next}` },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GalaxyCanvas />
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="glass rounded-2xl p-8 glow-pink">
          <h1
            className="text-lg font-bold tracking-wider text-glow mb-6 text-center"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {mode === "signin" ? "ENTRAR" : "CRIAR CONTA"}
          </h1>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/40 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
            >
              {mode === "signin" ? "Entrar" : "Cadastrar"}
            </button>
          </form>
          <button
            onClick={google}
            className="w-full mt-3 py-3 rounded-xl bg-secondary/50 border border-border/40 text-sm"
          >
            Continuar com Google
          </button>
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
