import React from 'react';
import { cn } from '@/lib/utils';

export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-7 w-12 items-center rounded-full transition-colors tap-target shrink-0',
        checked ? 'bg-primary' : 'bg-muted-foreground/25'
      )}
      aria-pressed={checked}
      aria-label={label}
    >
      <span className={cn(
        'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
        checked ? 'translate-x-6' : 'translate-x-1'
      )} />
    </button>
  );
}