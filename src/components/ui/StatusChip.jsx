import React from 'react';
import { cn } from '@/lib/utils';

const tones = {
  green: 'bg-primary/15 text-primary border-primary/20',
  amber: 'bg-warning/15 text-warning border-warning/25',
  red: 'bg-destructive/15 text-destructive border-destructive/25',
  accent: 'bg-accent/20 text-accent-foreground border-accent/30',
  muted: 'bg-muted text-muted-foreground border-border',
};

export default function StatusChip({ children, tone = 'muted', icon: Icon, className, pulse }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        tones[tone] || tones.muted,
        pulse && 'animate-pulse',
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}