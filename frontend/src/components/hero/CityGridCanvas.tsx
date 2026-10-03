import React, { useRef, useEffect } from 'react';

interface CityGridCanvasProps {
  stage?: number;
  focusedMarker?: { x: number; y: number };
}

export const CityGridCanvas: React.FC<CityGridCanvasProps> = ({ stage = 8 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // City grid road graph nodes & segments
    const cols = 9;
    const rows = 6;
    const nodes: { x: number; y: number; isIncident?: boolean; severity?: string; isFocus?: boolean }[] = [];

    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const nx = (c / cols) * width;
        const ny = (r / rows) * height * 0.9 + height * 0.05;
        const isFocus = (c === 4 && r === 3);
        const isIncident = isFocus || (c === 6 && r === 2) || (c === 2 && r === 4) || (c === 7 && r === 4);
        const severity = isFocus ? 'high' : (c === 6 && r === 2) ? 'critical' : 'medium';
        nodes.push({ x: nx, y: ny, isIncident, severity, isFocus });
      }
    }

    // Data particles traveling along grid lines
    interface Particle {
      x: number;
      y: number;
      speed: number;
      axis: 'x' | 'y';
      color: string;
    }

    const particles: Particle[] = Array.from({ length: 32 }, () => {
      const startNode = nodes[Math.floor(Math.random() * nodes.length)];
      return {
        x: startNode.x,
        y: startNode.y,
        speed: 1.2 + Math.random() * 2,
        axis: Math.random() > 0.5 ? 'x' : 'y',
        color: Math.random() > 0.4 ? '#00FF88' : '#00A3FF',
      };
    });

    let pulseAngle = 0;
    let pointRadius = 0;

    const render = () => {
      ctx.fillStyle = '#050B14';
      ctx.fillRect(0, 0, width, height);

      // Stage 1: Expanding glowing network from center point
      if (stage === 1) {
        pointRadius = Math.min(pointRadius + 2.5, 140);
        const cx = width / 2;
        const cy = height / 2;

        // Glowing center dot
        ctx.fillStyle = '#00FF88';
        ctx.shadowColor = '#00FF88';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Expanding radial wave
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, pointRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Radiating network lines
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2;
          ctx.strokeStyle = 'rgba(0, 163, 255, 0.25)';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(ang) * pointRadius * 1.5, cy + Math.sin(ang) * pointRadius * 1.5);
          ctx.stroke();
        }

        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Stage 2+: Draw city blocks & road grid
      if (stage >= 2) {
        // Draw faint city block fills
        ctx.fillStyle = 'rgba(13, 25, 40, 0.45)';
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x1 = (c / cols) * width + 4;
            const y1 = (r / rows) * height * 0.9 + height * 0.05 + 4;
            const w = (width / cols) - 8;
            const h = ((height * 0.9) / rows) - 8;
            ctx.fillRect(x1, y1, w, h);
          }
        }

        // Draw road network grid lines
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(0, 163, 255, 0.15)';
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const y = (r / rows) * height * 0.9 + height * 0.05;
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        for (let c = 0; c <= cols; c++) {
          const x = (c / cols) * width;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        ctx.stroke();

        // Main Arterial Glow Corridor (Central Demo Road Avenue)
        const midY = (3 / rows) * height * 0.9 + height * 0.05;
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();

        // Particles moving along road tracks
        particles.forEach((p) => {
          if (p.axis === 'x') {
            p.x += p.speed;
            if (p.x > width) p.x = 0;
          } else {
            p.y += p.speed;
            if (p.y > height) p.y = 0;
          }

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Stage 3+: Incident markers appear
      if (stage >= 3) {
        pulseAngle += 0.04;
        const pulseScale = 1 + Math.sin(pulseAngle) * 0.35;

        nodes.forEach((n) => {
          if (n.isIncident) {
            // In stage 4-6, only highlight focus or emphasize
            const isFocal = n.isFocus;
            const col = n.severity === 'critical' ? '#EF4444' : isFocal ? '#F59E0B' : '#00A3FF';

            // Outer radar ring
            ctx.strokeStyle = col;
            ctx.lineWidth = isFocal ? 2.5 : 1.5;
            ctx.beginPath();
            ctx.arc(n.x, n.y, (isFocal ? 22 : 14) * pulseScale, 0, Math.PI * 2);
            ctx.stroke();

            // Soft glow
            ctx.fillStyle = col;
            ctx.shadowColor = col;
            ctx.shadowBlur = isFocal ? 20 : 12;
            ctx.beginPath();
            ctx.arc(n.x, n.y, isFocal ? 6 : 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }

      // Radial dark vignette around edges so text pops cleanly
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.1,
        width / 2, height / 2, width * 0.65
      );
      gradient.addColorStop(0, 'rgba(5, 11, 20, 0.35)');
      gradient.addColorStop(0.7, 'rgba(5, 11, 20, 0.82)');
      gradient.addColorStop(1, '#050B14');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [stage]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};
