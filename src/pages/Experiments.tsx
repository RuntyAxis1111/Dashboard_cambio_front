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
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [videoInfo, setVideoInfo] = useState<any>(null);
      addLog('✅ Camera stream obtained');
  const [humanLoaded, setHumanLoaded] = useState(false);

  // Debug logging function
        addLog('❌ Video ref is null');
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLogs(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 logs
      addLog('🔗 Stream assigned to video element');
      
      // Get video track info
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setVideoInfo(settings);
        addLog(`📊 Video settings: ${settings.width}x${settings.height}`);
      }
    console.log(logEntry);
  };
      addLog('▶️ Video playing');

  useEffect(() => {
      addLog('🧠 Initializing Human.js...');
    addLog('🚀 Component mounted');
      addLog('✅ Human.js initialized');
      setHumanLoaded(true);
    return () => stop();
      addLog('🔥 Starting warmup...');
  }, []);
      addLog('✅ Warmup completed');

  async function start() {
    addLog('▶️ Start function called');
      addLog('🎯 Starting detection loop');
    
    try {
      addLog('📹 Requesting camera access...');
      const loop = async () => {
        if (!running || !videoRef.current || !canvasRef.current) return;
          if (!res) {
            addLog('⚠️ No detection result');
            return;
          }
          

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

        if (running) {
          addLog('⏹️ Loop stopped - missing refs or not running');
          addLog(`❌ Loop error: ${loopError}`);
          rafRef.current = requestAnimationFrame(loop);
        }
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      addLog(`❌ Start error: ${err}`);
      setError(`Error: ${err}`);
      setStatus('Error occurred');
      console.error('Start error:', err);
    }
  }

  function stop() {
    addLog('🛑 Stop function called');
    setStatus('Stopping...');
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
      addLog('⏹️ Animation frame cancelled');
    if (v?.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      v.srcObject = null;
      addLog('📴 Camera stream stopped');
    }
    setStatus('Stopped');
    setFps(0);
    setLabel('—');
    addLog('✅ Stop completed');
  }

  async function restartWithBackend(b: Backend) {
    addLog(`🔄 Restarting with backend: ${b}`);
    stop();
    setBackend(b);
    setTimeout(() => start(), 500); // Give time to stop
  }

  return (
    <div style={{ padding: 16, color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 8 }}>AI • Experiments — Emotion Detection</h1>
      
      {/* Status and Error Display */}
      <div style={{ marginBottom: 12, padding: 12, background: '#1f2937', borderRadius: 8, border: '1px solid #374151' }}>
        <div style={{ color: '#9ca3af', fontSize: 14 }}>Status: <span style={{ color: '#10b981' }}>{status}</span></div>
        <div style={{ color: '#9ca3af', fontSize: 14 }}>Human.js Loaded: <span style={{ color: humanLoaded ? '#10b981' : '#ef4444' }}>{humanLoaded ? 'Yes' : 'No'}</span></div>
        {error && <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>❌ {error}</div>}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={running ? stop : start}
          disabled={status.includes('...')}
          style={{ padding: '8px 16px', borderRadius: 10, background: running ? '#dc2626' : '#16a34a', color: '#fff', border: 'none', fontSize: 16, fontWeight: 'bold' }}
        >
          {running ? 'Stop' : 'Start'}
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => restartWithBackend('webgl')}
            disabled={running}
            style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #333', background: backend==='webgl'?'#111827':'#0b0f14', color:'#e5e7eb' }}>
            Backend: WebGL
          </button>
          <button onClick={() => restartWithBackend('wasm')}
            disabled={running}
            style={{ padding:'8px 12px', borderRadius:10, border:'1px solid #333', background: backend==='wasm'?'#111827':'#0b0f14', color:'#e5e7eb' }}>
            Backend: WASM
          </button>
        </div>

        <span style={{ color:'#9ca3af' }}>FPS: {fps}</span>
        <span style={{ color:'#9BE6C9' }}>Top Emotion: {label}</span>
      </div>

      <video ref={videoRef} playsInline autoPlay muted style={{ display:'none' }} />
      <canvas 
        ref={canvasRef} 
        width={640} 
        height={480} 
        style={{ 
          width:'100%', 
          maxWidth: 640,
          height: 'auto',
          borderRadius:12, 
          border:'3px solid #22c55e',
          background: '#1f2937',
          display: 'block',
          marginBottom: 16
        }} 
      />
      <p style={{ marginTop:8, color:'#9ca3af' }}>Tip: si baja el FPS, prueba WASM o baja resolución.</p>
      
      {/* Enhanced Debug Info */}
      <div style={{ marginTop: 16, padding: 12, background: '#111827', borderRadius: 8, fontSize: 12, color: '#6b7280', border: '1px solid #374151' }}>
        <h3 style={{ color: '#fff', marginBottom: 8, fontSize: 14 }}>🔧 Debug Information</h3>
        
        {/* Video Element State */}
        <div style={{ marginBottom: 12, padding: 8, background: '#1f2937', borderRadius: 6 }}>
          <div style={{ color: '#fff', marginBottom: 4, fontSize: 13 }}>📹 Video Element:</div>
          <div>Ready State: {videoRef.current?.readyState || 'N/A'}</div>
          <div>Video Width: {videoRef.current?.videoWidth || 'N/A'}</div>
          <div>Video Height: {videoRef.current?.videoHeight || 'N/A'}</div>
          <div>Paused: {videoRef.current?.paused ? 'Yes' : 'No'}</div>
          <div>Has Stream: {videoRef.current?.srcObject ? 'Yes' : 'No'}</div>
        </div>
        
        {/* Canvas State */}
        <div style={{ marginBottom: 12, padding: 8, background: '#1f2937', borderRadius: 6 }}>
          <div style={{ color: '#fff', marginBottom: 4, fontSize: 13 }}>🎨 Canvas Element:</div>
          <div>Canvas Width: {canvasRef.current?.width || 'N/A'}</div>
          <div>Canvas Height: {canvasRef.current?.height || 'N/A'}</div>
          <div>Context Available: {canvasRef.current?.getContext('2d') ? 'Yes' : 'No'}</div>
        </div>
        
        {/* Video Track Info */}
        {videoInfo && (
          <div style={{ marginBottom: 12, padding: 8, background: '#1f2937', borderRadius: 6 }}>
            <div style={{ color: '#fff', marginBottom: 4, fontSize: 13 }}>📊 Stream Settings:</div>
            <div>Resolution: {videoInfo.width}x{videoInfo.height}</div>
            <div>Frame Rate: {videoInfo.frameRate}fps</div>
            <div>Device ID: {videoInfo.deviceId?.substring(0, 8)}...</div>
          </div>
        )}
        
        {/* Debug Logs */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: '#fff', marginBottom: 4, fontSize: 13 }}>📝 Debug Log:</div>
          <div style={{ maxHeight: 200, overflowY: 'auto', background: '#0f172a', padding: 8, borderRadius: 4, border: '1px solid #334155' }}>
            {debugLogs.length === 0 ? (
              <div style={{ color: '#64748b' }}>No logs yet...</div>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} style={{ color: '#e2e8f0', fontSize: 11, fontFamily: 'monospace', marginBottom: 2 }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Manual Controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setDebugLogs([])}
            style={{ padding: '4px 8px', background: '#374151', border: '1px solid #4b5563', borderRadius: 6, color: '#e5e7eb', fontSize: 11 }}
          >
            Clear Logs
          </button>
          <button
            onClick={() => {
              if (videoRef.current) {
                addLog('👆 Manual video play attempt');
                videoRef.current.play().catch(e => addLog(`❌ Manual play failed: ${e}`));
              }
            }}
            style={{ padding: '4px 8px', background: '#374151', border: '1px solid #4b5563', borderRadius: 6, color: '#e5e7eb', fontSize: 11 }}
          >
            Force Play Video
          </button>
          <button
            onClick={() => {
              addLog('🔄 Manual canvas test');
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                  ctx.fillStyle = '#ff0000';
                  ctx.fillRect(0, 0, 100, 100);
                  addLog('✅ Canvas test: red square drawn');
                } else {
                  addLog('❌ Canvas context not available');
                }
              }
            }}
            style={{ padding: '4px 8px', background: '#374151', border: '1px solid #4b5563', borderRadius: 6, color: '#e5e7eb', fontSize: 11 }}
          >
            Test Canvas
          </button>
        </div>
        <div>Canvas dimensions: {canvasRef.current?.width || 'N/A'} x {canvasRef.current?.height || 'N/A'}</div>
        <div>Video ready: {videoRef.current?.readyState || 'N/A'}</div>
        <div>Backend: {backend}</div>
      </div>
    </div>
  );
}

export { Experiments }