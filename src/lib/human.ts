import Human from '@vladmandic/human';

let human: Human | null = null;
export type Backend = 'webgl' | 'wasm';

export async function initHuman(backend: Backend = 'webgl') {
  if (human && (human.config.backend as Backend) === backend) return human;
  human = new Human({
    backend,
    modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models',
    cacheSensitivity: 0,
    face: {
      enabled: true,
      detector: { rotation: true, maxDetected: 1 },
      mesh: { enabled: true },   // 468 landmarks
      iris: { enabled: true },
      emotion: { enabled: true } // clasificador de emoción
    },
    hand: { enabled: false },
    body: { enabled: false },
    gesture: { enabled: false }
  });
  await human.load();
  return human;
}

export async function warmup(video: HTMLVideoElement) {
  if (!human) throw new Error('Human not initialized');
  await human.warmup();
  await human.detect(video);
}

export async function detectOnce(video: HTMLVideoElement) {
  if (!human) throw new Error('Human not initialized');
  const res = await human.detect(video);
  return res;
}

export function drawFrame(canvas: HTMLCanvasElement, video: HTMLVideoElement, result: any) {
  if (!human) throw new Error('Human not initialized');
  human.draw.all(canvas, result);
}

export function getTopEmotion(result: any): { emotion: string; score: number } | null {
  const emotions = result?.face?.[0]?.emotion;
  if (!emotions?.length) return null;
  const top = emotions.slice().sort((a:any,b:any)=>b.score-a.score)[0];
  return { emotion: top.emotion, score: top.score };
}