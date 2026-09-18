let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  ctx ??= new AudioContext();
  return ctx;
}

export function honkTwice() {
  const ac = audio();
  if (!ac) return;
  void ac.resume();
  const now = ac.currentTime;
  [0, 0.18].forEach((offset) => beep(ac, now + offset, 196, 0.14));
}

function beep(ac: AudioContext, at: number, freq: number, dur: number) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.05, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

export function pageRustle() {
  const ac = audio();
  if (!ac) return;
  void ac.resume();
  const now = ac.currentTime;
  const buffer = ac.createBuffer(1, ac.sampleRate * 0.12, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const gain = ac.createGain();
  filter.type = "highpass";
  filter.frequency.value = 900;
  gain.gain.value = 0.04;
  src.buffer = buffer;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  src.start(now);
}
