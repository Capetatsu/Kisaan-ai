import React from 'react';
import { cn } from '@/lib/utils';

const tones = {
  green: 'bg-primary/12 text-primary',
  amber: 'bg-tangerine/12 text-tangerine',
  red: 'bg-berry/12 text-berry',
  accent: 'bg-accent/12 text-accent',
  water: 'bg-water/12 text-water',
  sun: 'bg-sun/20 text-sun',
  white: 'bg-white/25 text-white',
  'white-solid': 'bg-white text-primary',
  muted: 'bg-muted text-muted-foreground',
};

export default function StatusChip({ children, tone = 'muted', icon: Icon, className, pulse }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide',
        tones[tone] || tones.muted,
        pulse && 'animate-pulse',
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" strokeWidth={2.6} />}
      {children}
    </span>
  );
}