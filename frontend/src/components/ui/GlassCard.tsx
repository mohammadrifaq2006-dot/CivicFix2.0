import React, { HTMLAttributes, ReactNode, useRef, useState } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glowOnHover?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glowOnHover = true,
  intensity = 'medium',
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowOnHover) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const bgStyles = {
    low: 'bg-[#0A111B]/80 border-white/[0.05]',
    medium: 'bg-[#0F1926]/85 border-white/[0.08]',
    high: 'bg-[#142337]/90 border-cyan-500/20 shadow-glow-cyan',
  }[intensity];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden ${bgStyles} ${className}`}
      {...props}
    >
      {/* Dynamic cursor light tracking */}
      {glowOnHover && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 229, 255, 0.12), transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
