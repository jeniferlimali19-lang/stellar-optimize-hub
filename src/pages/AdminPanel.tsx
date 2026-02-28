import { useState, useEffect } from "react";
import GalaxyCanvas from "@/components/GalaxyCanvas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [keys, setKeys] = useState<{ id: string; password: string; label: string | null; active: boolean; created_at: string }[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchKeys = async () => {
    const { data, error } = await supabase
      .from("access_keys")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar chaves");
    } else {
      setKeys(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const addKey = async () => {
    if (!newPassword.trim()) {
      toast.error("Digite uma senha");
      return;
    }
    const { error } = await supabase
      .from("access_keys")
      .insert({ password: newPassword.trim(), label: newLabel.trim() || null });
    if (error) {
      toast.error("Erro ao criar chave");
    } else {
      toast.success("Chave criada com sucesso!");
      setNewPassword("");
      setNewLabel("");
      fetchKeys();
    }
  };

  const toggleKey = async (id: string, active: boolean) => {
    await supabase.from("access_keys").update({ active: !active }).eq("id", id);
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    await supabase.from("access_keys").delete().eq("id", id);
    toast.success("Chave removida");
    fetchKeys();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GalaxyCanvas />
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="glass rounded-2xl glow-pink overflow-hidden">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-border/30">
            <h1 className="text-lg font-bold tracking-wider text-glow" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              PAINEL ADM
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg bg-secondary/50"
            >
              Sair
            </button>
          </div>

          {/* Create new key */}
          <div className="p-5 border-b border-border/30 space-y-3">
            <h2 className="text-sm font-semibold text-primary tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              CRIAR NOVA CHAVE
            </h2>
            <input
              type="text"
              placeholder="Nome da chave (opcional)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
            />
            <input
              type="text"
              placeholder="Senha de acesso"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 text-sm"
            />
            <button
              onClick={addKey}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm tracking-wider hover:brightness-110 transition-all glow-pink-sm active:scale-[0.98]"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              + CRIAR CHAVE
            </button>
          </div>

          {/* Keys list */}
          <div className="p-5 space-y-2 max-h-80 overflow-y-auto">
            <h2 className="text-sm font-semibold text-primary tracking-wide mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              CHAVES ({keys.length})
            </h2>
            {loading ? (
              <p className="text-muted-foreground text-sm text-center py-4">Carregando...</p>
            ) : keys.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">Nenhuma chave criada</p>
            ) : (
              keys.map((key) => (
                <div
                  key={key.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    key.active
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-secondary/30 border border-border/20 opacity-50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {key.label || "Sem nome"}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">{key.password}</p>
                  </div>
                  <button
                    onClick={() => toggleKey(key.id, key.active)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                      key.active
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {key.active ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="text-xs px-2.5 py-1 rounded-md bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
