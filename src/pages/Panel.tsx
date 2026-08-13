import { useState, useEffect } from "react";
import GalaxyCanvas from "@/components/GalaxyCanvas";
import { toast } from "sonner";
import { optimizer, type FeatureKey } from "@/lib/optimizer";


const FunctionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.5 12.5V17.5M12 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

// SVG for Reduzir Recuo
const RecoilIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="20" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" opacity="0.3" />
    <circle cx="22" cy="22" r="14" stroke="hsl(330, 90%, 56%)" strokeWidth="1" opacity="0.2" />
    {/* Crosshair */}
    <circle cx="22" cy="22" r="3" fill="hsl(330, 90%, 56%)" opacity="0.8" />
    <line x1="22" y1="8" x2="22" y2="17" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="27" x2="22" y2="36" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="22" x2="17" y2="22" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="27" y1="22" x2="36" y2="22" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Compression arrows */}
    <path d="M14 14L18 18" stroke="hsl(320, 80%, 50%)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 14L26 18" stroke="hsl(320, 80%, 50%)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 30L18 26" stroke="hsl(320, 80%, 50%)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 30L26 26" stroke="hsl(320, 80%, 50%)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// SVG for Input Lag
const InputLagIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="18" stroke="hsl(330, 90%, 56%)" strokeWidth="1" opacity="0.2" />
    {/* Clock face */}
    <circle cx="22" cy="22" r="12" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" opacity="0.6" />
    <circle cx="22" cy="22" r="2" fill="hsl(330, 90%, 56%)" />
    {/* Clock hands */}
    <line x1="22" y1="22" x2="22" y2="14" stroke="hsl(330, 100%, 75%)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="22" x2="28" y2="22" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Lightning bolt for speed */}
    <path d="M32 8L29 16H33L28 24" stroke="hsl(320, 80%, 50%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Speed lines */}
    <line x1="6" y1="18" x2="10" y2="18" stroke="hsl(330, 90%, 56%)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    <line x1="5" y1="22" x2="10" y2="22" stroke="hsl(330, 90%, 56%)" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
    <line x1="6" y1="26" x2="10" y2="26" stroke="hsl(330, 90%, 56%)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
  </svg>
);

// SVG for Otimizar Touch
const TouchIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Finger */}
    <path d="M22 8C19.8 8 18 9.8 18 12V24L15.5 21.5C14.3 20.3 12.3 20.3 11.1 21.5C9.9 22.7 9.9 24.7 11.1 25.9L19 34C20.5 35.5 22.5 36 24 36H28C32.4 36 36 32.4 36 28V20C36 18.3 34.7 17 33 17C31.3 17 30 18.3 30 20V18C30 16.3 28.7 15 27 15C25.3 15 24 16.3 24 18V16C24 14.3 22.7 13 22 13" stroke="hsl(330, 90%, 56%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Touch waves */}
    <path d="M15 10C15 10 13 8 10 8" stroke="hsl(320, 80%, 50%)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    <path d="M14 13C14 13 12.5 12 10.5 12" stroke="hsl(320, 80%, 50%)" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
    {/* Sparkle */}
    <circle cx="8" cy="6" r="1.5" fill="hsl(330, 100%, 75%)" opacity="0.6" />
    <circle cx="36" cy="10" r="1" fill="hsl(330, 90%, 56%)" opacity="0.4" />
  </svg>
);

const Panel = () => {
  const [activeTab, setActiveTab] = useState<"functions" | "info">("functions");
  const [toggles, setToggles] = useState(() => optimizer.getState());

  useEffect(() => {
    optimizer.start();
    setToggles(optimizer.getState());
    return optimizer.subscribe(setToggles);
  }, []);

  const handleToggle = (key: FeatureKey) => {
    const next = !optimizer.getState()[key];
    optimizer.set(key, next);
    const labels = { recoil: "Reduzir Recuo", inputLag: "Retirar Input Lag", touch: "Otimizar Touch" };
    toast.success(`${labels[key]} ${next ? "ativado — rodando em segundo plano" : "desativado"}!`);
  };


  const openFreeFire = () => {
    window.location.href = "freefireth://";
  };

  const functions = [
    { key: "recoil" as const, label: "Reduzir Recuo", desc: "Remove o recuo das armas", icon: <RecoilIcon /> },
    { key: "inputLag" as const, label: "Retirar Input Lag", desc: "Elimina atraso de entrada", icon: <InputLagIcon /> },
    { key: "touch" as const, label: "Otimizar Touch", desc: "Melhora a resposta do toque", icon: <TouchIcon /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GalaxyCanvas />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass rounded-2xl glow-pink overflow-hidden">
          {/* Header */}
          <div className="p-5 text-center border-b border-border/30">
            <h1 className="text-lg font-bold tracking-wider text-glow">PAINEL PRO</h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/30">
            <button
              onClick={() => setActiveTab("functions")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wide transition-all ${
                activeTab === "functions"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <FunctionsIcon />
              FUNÇÕES
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wide transition-all ${
                activeTab === "info"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <InfoIcon />
              INFORMAÇÕES
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {activeTab === "functions" ? (
              <div className="space-y-3">
                {functions.map((fn) => (
                  <div
                    key={fn.key}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                      toggles[fn.key]
                        ? "bg-primary/10 border border-primary/30 glow-pink-sm"
                        : "bg-secondary/50 border border-border/30 hover:border-primary/20"
                    }`}
                    onClick={() => handleToggle(fn.key)}
                  >
                    <div className={`flex-shrink-0 transition-all ${toggles[fn.key] ? "animate-pulse-glow" : "opacity-60"}`}>
                      {fn.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        {fn.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{fn.desc}</p>
                    </div>
                    <div
                      className={`w-11 h-6 rounded-full flex items-center transition-all ${
                        toggles[fn.key] ? "bg-primary justify-end" : "bg-muted justify-start"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full mx-0.5 transition-all ${
                        toggles[fn.key] ? "bg-primary-foreground shadow-lg" : "bg-muted-foreground/40"
                      }`} />
                    </div>
                  </div>
                ))}

                {/* Free Fire Button */}
                <button
                  onClick={openFreeFire}
                  className="w-full mt-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold tracking-wider hover:brightness-110 transition-all glow-pink-sm active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 3L16 10L4 17V3Z" fill="currentColor" />
                  </svg>
                  ABRIR FREE FIRE
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                  <h3 className="font-semibold text-primary mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Sobre o Painel
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Painel de otimização para melhorar sua experiência no Free Fire. Ative as funções desejadas e abra o jogo para aplicar.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                  <h3 className="font-semibold text-primary mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Como usar
                  </h3>
                  <ol className="text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Ative as funções desejadas</li>
                    <li>Clique em "Abrir Free Fire"</li>
                    <li>Jogue com as otimizações ativas</li>
                  </ol>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/30">
                  <h3 className="font-semibold text-primary mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Versão
                  </h3>
                  <p className="text-muted-foreground">v1.0.0 — Painel Pro</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
