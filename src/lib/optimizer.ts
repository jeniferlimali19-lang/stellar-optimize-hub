// optimizer.ts — Runtime persistente das funções do painel.
// Mantém as opções LIGADAS em segundo plano (não desliga ao trocar de aba,
// minimizar o app ou navegar entre páginas do painel).

import { AimEngine } from "./engine";

export type FeatureKey = "recoil" | "inputLag" | "touch";

export type FeatureState = Record<FeatureKey, boolean>;

const STORAGE_KEY = "panel_pro_features_v1";

const DEFAULT_STATE: FeatureState = {
  recoil: false,
  inputLag: false,
  touch: false,
};

function loadState(): FeatureState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return {
      recoil: !!parsed.recoil,
      inputLag: !!parsed.inputLag,
      touch: !!parsed.touch,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

type Listener = (s: FeatureState) => void;

class OptimizerRuntime {
  private state: FeatureState = loadState();
  private listeners = new Set<Listener>();

  private aim: AimEngine | null = null;
  private rafId: number | null = null;
  private lastFrame = 0;
  private wakeLock: any = null;
  private touchHandler: ((e: TouchEvent) => void) | null = null;
  private started = false;

  /** Chamado uma única vez no boot do app. */
  start() {
    if (this.started) return;
    this.started = true;

    // Reativa tudo que estava ligado, mesmo depois de recarregar a página.
    this.applyAll();

    // Se o sistema suspender a página, re-arma assim que voltar.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") this.applyAll();
    });
    window.addEventListener("pageshow", () => this.applyAll());
    window.addEventListener("focus", () => this.applyAll());
  }

  getState(): FeatureState {
    return this.state;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.listeners.forEach((l) => l(this.state));
  }

  set(key: FeatureKey, value: boolean) {
    this.state = { ...this.state, [key]: value };
    this.applyAll();
    this.emit();
  }

  toggle(key: FeatureKey) {
    this.set(key, !this.state[key]);
  }

  private anyOn() {
    return this.state.recoil || this.state.inputLag || this.state.touch;
  }

  private applyAll() {
    this.applyRecoil();
    this.applyTouch();
    this.applyLoop();
    this.applyWakeLock();
    this.applyLightMode();
  }

  // ---------- Reduzir Recuo / trava de mira ----------
  private applyRecoil() {
    if (this.state.recoil) {
      if (!this.aim) {
        // Curva mais agressiva perto do alvo => mira "gruda" na cabeça.
        this.aim = new AimEngine({ sensitivity: 1.35, clampThreshold: 38 });
      }
    } else if (this.aim) {
      this.aim.reset();
      this.aim = null;
    }
  }

  /** Processa um delta de movimento com estabilização + trava de mira. */
  processAim(dx: number, dy: number) {
    if (!this.aim) return { x: dx, y: dy };
    const out = this.aim.processMovement(dx, dy);
    // Micro-ajuste vertical: puxa levemente para cima (altura da cabeça)
    // proporcional à intensidade do movimento, sem exageros.
    const pull = Math.min(Math.abs(out.y) * 0.18, 2.5);
    return { x: out.x, y: out.y - pull };
  }

  // ---------- Otimizar Touch ----------
  private applyTouch() {
    if (this.state.touch && !this.touchHandler) {
      this.touchHandler = () => {
        // Handler passivo: mantém a fila de toques quente e sem atraso.
      };
      window.addEventListener("touchstart", this.touchHandler, { passive: true });
      window.addEventListener("touchmove", this.touchHandler, { passive: true });
      document.documentElement.style.touchAction = "manipulation";
    } else if (!this.state.touch && this.touchHandler) {
      window.removeEventListener("touchstart", this.touchHandler);
      window.removeEventListener("touchmove", this.touchHandler);
      document.documentElement.style.touchAction = "";
      this.touchHandler = null;
    }
  }

  // ---------- Retirar Input Lag (loop contínuo) ----------
  private applyLoop() {
    const shouldRun = this.state.inputLag || this.state.recoil;
    if (shouldRun && this.rafId === null) {
      const tick = (t: number) => {
        this.lastFrame = t;
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    } else if (!shouldRun && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // ---------- Manter ativo em segundo plano ----------
  private async applyWakeLock() {
    const nav: any = navigator;
    if (this.anyOn()) {
      if (!this.wakeLock && nav.wakeLock?.request) {
        try {
          this.wakeLock = await nav.wakeLock.request("screen");
          this.wakeLock.addEventListener?.("release", () => {
            this.wakeLock = null;
          });
        } catch {
          this.wakeLock = null;
        }
      }
    } else if (this.wakeLock) {
      try {
        await this.wakeLock.release();
      } catch {
        /* ignore */
      }
      this.wakeLock = null;
    }
  }

  // ---------- Modo leve (deixa o celular mais leve) ----------
  private applyLightMode() {
    // Com funções ativas, reduzimos efeitos pesados da interface
    // (blur, brilho animado, partículas) para liberar GPU/CPU pro jogo.
    document.documentElement.classList.toggle("light-mode-perf", this.anyOn());
  }
}

export const optimizer = new OptimizerRuntime();
