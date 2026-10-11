import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  barCount?: number;
  height?: number;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  barCount = 28,
  height = 36,
  color = '#22c55e',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const barWidth = width / barCount - 2.5;
      for (let i = 0; i < barCount; i++) {
        const barHeight = 3;
        const x = i * (barWidth + 2.5);
        const y = (canvas.height - barHeight) / 2;
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 2, 2]);
        ctx.fill();
      }
      return;
    }

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const barWidth = width / barCount - 2.5;

      for (let i = 0; i < barCount; i++) {
        const sinVal = Math.sin(phase + i * 0.38) * 0.5 + 0.5;
        const cosVal = Math.cos(phase * 0.9 + i * 0.22) * 0.3 + 0.3;
        const barHeight = Math.max(4, (sinVal * 0.72 + cosVal * 0.28) * (canvas.height - 4));

        const x = i * (barWidth + 2.5);
        const y = (canvas.height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#38bdf8');   // Sky blue
        gradient.addColorStop(0.4, '#3b82f6'); // Royal blue
        gradient.addColorStop(0.8, '#8b5cf6'); // Violet
        gradient.addColorStop(1, '#ec4899');   // Pink accent

        ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 3, 3]);
        ctx.fill();
      }

      phase += 0.14;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, barCount, color]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={180}
        height={height}
        className="w-full h-full max-w-[200px]"
      />
    </div>
  );
};
