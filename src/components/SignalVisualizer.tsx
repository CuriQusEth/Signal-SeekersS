import { useEffect, useRef } from 'react';

interface SignalVisualizerProps {
  currentFreq: number;
  targetFreq: number;
  noiseLevel: number;
}

export function SignalVisualizer({ currentFreq, targetFreq, noiseLevel }: SignalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.05;
      
      // Clear canvas with trail effect for glow
      ctx.fillStyle = 'rgba(5, 7, 10, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      // Calculate signal match (0 to 1)
      const diff = Math.abs(currentFreq - targetFreq);
      const isLocked = diff < 0.5;
      const matchQuality = Math.max(0, 1 - (diff / 10)); // 1 when exact match
      
      ctx.lineWidth = 2;

      // Draw Noise
      ctx.beginPath();
      ctx.strokeStyle = `rgba(160, 174, 192, ${0.1 + noiseLevel * 0.005})`; // Grayish noise
      for (let x = 0; x < width; x += 5) {
        const y = centerY + (Math.random() - 0.5) * noiseLevel * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Main Signal Wave
      ctx.beginPath();
      // Wave color turns cyan when locked
      ctx.strokeStyle = isLocked ? '#22d3ee' : `rgba(34, 211, 238, ${matchQuality + 0.2})`;
      ctx.shadowBlur = isLocked ? 20 : 10 * matchQuality;
      ctx.shadowColor = '#22d3ee';
      
      const amplitude = 30 + (matchQuality * 40);
      const waveFreq = 0.02 + (currentFreq * 0.001);

      for (let x = 0; x < width; x++) {
        const wave1 = Math.sin(x * waveFreq + time) * amplitude;
        // Introduce chaos if not matching
        const chaos = (1 - matchQuality) * (Math.random() - 0.5) * 50;
        const y = centerY + wave1 + chaos;
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentFreq, targetFreq, noiseLevel]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full border border-white/5 bg-transparent"
      style={{ borderRadius: '50%' }}
    />
  );
}
