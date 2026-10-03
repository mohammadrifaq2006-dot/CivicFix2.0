import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { soundService } from '../../services/soundService';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  showSweep?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  showSweep = true,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundService.playClick();
    if (onClick) onClick(e);
  };

  const baseStyles = 
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 ' +
    'rounded-xl select-none active:translate-y-[1px] active:scale-[0.98] ' +
    'hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ' +
    'disabled:opacity-50 disabled:pointer-events-none ' + (showSweep ? 'btn-sweep ' : '');

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 tracking-wide',
    md: 'text-sm px-5 py-2.5 gap-2 tracking-wide font-semibold',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold tracking-tight',
  }[size];

  const variantStyles = {
    primary: 
      'bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#0284c7] text-[#050B14] font-bold shadow-lg shadow-cyan-500/25 ' +
      'hover:shadow-cyan-400/50 hover:brightness-110 border border-cyan-200/50 backdrop-blur-md',
    accent:
      'bg-gradient-to-r from-[#00FF88] to-[#10B981] text-[#050B14] font-bold shadow-lg shadow-emerald-500/25 ' +
      'hover:shadow-emerald-400/50 hover:brightness-110 border border-emerald-300/50 backdrop-blur-md',
    secondary: 
      'bg-[#0D1928]/85 backdrop-blur-xl text-[#F5F9FF] border border-white/10 shadow-glass ' +
      'hover:border-cyan-400/40 hover:bg-[#122238] hover:text-white hover:shadow-cyan-500/15',
    outline: 
      'bg-transparent text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/10 ' +
      'hover:border-cyan-400 shadow-sm',
    danger: 
      'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/30 ' +
      'hover:shadow-red-500/50 border border-red-400/30',
    ghost: 
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="transition-transform duration-200 group-hover:translate-x-1">{icon}</span>}
    </button>
  );
};
