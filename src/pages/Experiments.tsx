import { useEffect, useRef, useState } from 'react';
import { initHuman, warmup, detectOnce, drawFrame, getTopEmotion, type Backend } from '../lib/human';

export default function Experiments() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [backend, setBackend] = useState<Backend>('webgl');
  const [fps, setFps] = useState(0);
  const [label, setLabel] = useState<string>('—');

  useEffect(() => {
    return () => stop();
  }, []);

  async function start() {
    if (!videoRef.current || !canvasRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });
    videoRef.current.srcObject = stream;
    await videoRef.current.play();

    await initHuman(backend);
    await warmup(videoRef.current);

    setRunning(true);
    let last = performance.now();

    const loop = async () => {
      if (!running || !videoRef.current || !canvasRef.current) return;

      const res = await detectOnce(videoRef.current);
      drawFrame(canvasRef.current, videoRef.current, res);

      const top = getTopEmotion(res);
      const ctx = canvasRef.current.getContext('2d')!;
      ctx.fillStyle = 'rgba(0,0,0,.6)';
      ctx.fillRect(12, 12, 220, 46);
      ctx.fillStyle = '#9BE6C9';
      ctx.font = '600 16px system-ui';
      const text = top ? `Emotion: ${top.emotion} (${(top.score*100).toFixed(0)}%)` : 'Emotion: —';
      ctx.fillText(text, 22, 42);
      setLabel(top ? top.emotion : '—');

      const now = performance.now();
      setFps(Math.round(1000 / (now - last)));
      last = now;

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }

  function stop() {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
    if (v?.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      v.srcObject = null;
    }
  }

  async function restartWithBackend(b: Backend) {
    stop();
    setBackend(b);
    await start();
  }

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>AI • Experiments — Emotion Detection</h1>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={running ? stop : start}
          style={{ padding: '8px 12px', borderRadius: 10, background: running ? '#dc2626' : '#16a34a', color: '#fff', border: 'none' }}
        >
          {running ? 'Stop' : 'Start'}
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => restartWithBackend('webgl')}
            style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #333', background: backend==='webgl'?'#111827':'#0b0f14', color:'#e5e7eb' }}>
            Backend: WebGL
          </button>
          <button onClick={() => restartWithBackend('wasm')}
            style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #333', background: backend==='wasm'?'#111827':'#0b0f14', color:'#e5e7eb' }}>
            Backend: WASM
          </button>
        </div>

        <span style={{ color:'#9ca3af' }}>FPS: {fps}</span>
        <span style={{ color:'#9BE6C9' }}>Top Emotion: {label}</span>
      </div>

      <video ref={videoRef} playsInline autoPlay muted style={{ display:'none' }} />
      <canvas ref={canvasRef} width={640} height={480} style={{ width:'100%', borderRadius:12, border:'1px solid #222' }} />
      <p style={{ marginTop:8, color:'#9ca3af' }}>Tip: si baja el FPS, prueba WASM o baja resolución.</p>
    </div>
  );
}