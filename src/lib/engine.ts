// engine.ts - Lógica de Curva e Estabilização

interface MovementDelta {
  x: number;
  y: number;
}

interface AimEngineConfig {
  sensitivity?: number;
  linearFactor?: number;
  clampThreshold?: number;
}

export class AimEngine {
  private sensitivity: number;
  private clampThreshold: number;
  private buffer: MovementDelta[];
  private bufferSize: number;

  constructor(config: AimEngineConfig = {}) {
    this.sensitivity = config.sensitivity || 1.0;
    this.clampThreshold = config.clampThreshold || 50;
    this.buffer = [];
    this.bufferSize = 3;
  }

  applyBezierCurve(input: number): number {
    const t = Math.min(Math.abs(input) / 100, 1);
    const p1 = this.sensitivity * 1.5;
    const scaledOutput = (2 * (1 - t) * t * p1 + Math.pow(t, 2)) * input;
    return scaledOutput;
  }

  processMovement(deltaX: number, deltaY: number): MovementDelta {
    this.buffer.push({ x: deltaX, y: deltaY });
    if (this.buffer.length > this.bufferSize) this.buffer.shift();

    const avgX = this.buffer.reduce((a, b) => a + b.x, 0) / this.buffer.length;
    const avgY = this.buffer.reduce((a, b) => a + b.y, 0) / this.buffer.length;

    const velocity = Math.sqrt(avgX ** 2 + avgY ** 2);
    let finalX = avgX;
    let finalY = avgY;

    if (velocity > this.clampThreshold) {
      const scale = this.clampThreshold / velocity;
      finalX *= scale;
      finalY *= scale;
    } else if (velocity < 5) {
      finalX *= 0.8;
      finalY *= 0.8;
    }

    return {
      x: this.applyBezierCurve(finalX),
      y: this.applyBezierCurve(finalY),
    };
  }

  reset() {
    this.buffer = [];
  }
}
