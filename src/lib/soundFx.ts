// Sound and visual celebration effects using Web Audio API and canvas-confetti
import confetti from "canvas-confetti";

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

export const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("focusforge_sound_enabled");
  return stored === null ? true : stored === "true";
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("focusforge_sound_enabled", String(enabled));
};

// Play a crystal-clear rewarding task completion chime
export const playTaskCompleteSound = (): void => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major Pentatonic Chime)

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0, now + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.65);
  });
};

// Play a tactile, satisfying pop for checking subtasks
export const playSubtaskSound = (): void => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(587.33, now); // D5
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.06); // A5

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
};

// Play a triumphant fanfare when leveling up or hitting daily milestone
export const playLevelUpSound = (): void => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const chordSequence = [
    { freq: 440, time: 0 },       // A4
    { freq: 554.37, time: 0.1 },  // C#5
    { freq: 659.25, time: 0.2 },  // E5
    { freq: 880, time: 0.35 },    // A5
    { freq: 1108.73, time: 0.5 }, // C#6
  ];

  chordSequence.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    gain.gain.setValueAtTime(0, now + note.time);
    gain.gain.linearRampToValueAtTime(0.22, now + note.time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + 0.75);
  });
};

// Play smooth focus tone when initiating deep work session
export const playFocusStartSound = (): void => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(329.63, now); // E4
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.4); // A4

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 1.3);
};

// Confetti animations
export const triggerConfetti = (type: "standard" | "fireworks" | "stars" | "streak" = "standard"): void => {
  if (typeof window === "undefined") return;

  try {
    if (type === "standard") {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"],
      });
    } else if (type === "streak") {
      // Warm fiery burst
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#F97316", "#EF4444", "#FBBF24", "#F59E0B"],
      });
    } else if (type === "stars") {
      confetti({
        shapes: ["star"],
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF69B4", "#7B68EE"],
      });
    } else if (type === "fireworks") {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  } catch (e) {
    console.error("Confetti error:", e);
  }
};
