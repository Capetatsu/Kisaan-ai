import React from 'react';
import { cn } from '@/lib/utils';

export default function GlassCard({ children, className, onClick, strong, glow, style }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-2xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]',
        glow && 'glow-ring',
        onClick && 'cursor-pointer active:scale-[0.985] transition-transform duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}