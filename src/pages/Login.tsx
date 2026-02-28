import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GalaxyCanvas from "@/components/GalaxyCanvas";
import { toast } from "sonner";

const Login = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123") {
      navigate("/panel");
    } else {
      toast.error("Senha incorreta!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GalaxyCanvas />

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="glass rounded-2xl p-8 glow-pink">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="36" stroke="hsl(330, 90%, 56%)" strokeWidth="2" fill="none" opacity="0.3" />
              <circle cx="40" cy="40" r="28" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" fill="none" opacity="0.5" />
              <path d="M40 16L44 28H56L46 36L50 48L40 40L30 48L34 36L24 28H36L40 16Z" fill="hsl(330, 90%, 56%)" opacity="0.9" />
              <circle cx="40" cy="40" r="6" fill="hsl(320, 80%, 50%)" />
              <circle cx="40" cy="40" r="3" fill="hsl(330, 100%, 80%)" />
              {/* Orbiting dots */}
              <circle cx="40" cy="12" r="2.5" fill="hsl(330, 90%, 56%)">
                <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="8s" repeatCount="indefinite" />
              </circle>
              <circle cx="68" cy="40" r="2" fill="hsl(320, 80%, 50%)">
                <animateTransform attributeName="transform" type="rotate" from="120 40 40" to="480 40 40" dur="12s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="60" r="1.5" fill="hsl(330, 100%, 75%)">
                <animateTransform attributeName="transform" type="rotate" from="240 40 40" to="600 40 40" dur="10s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <h1 className="text-xl font-bold text-center mb-1 text-glow tracking-wider">
            PAINEL PRO
          </h1>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Digite a senha para acessar
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all text-center tracking-widest"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold tracking-wider hover:brightness-110 transition-all glow-pink-sm active:scale-[0.98]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
