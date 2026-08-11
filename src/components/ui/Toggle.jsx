import React from 'react';
import { cn } from '@/lib/utils';

export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn(
        'relative inline-flex h-8 w-[52px] items-center rounded-full border-2 px-[3px] transition-colors tap-target shrink-0',
        checked ? 'bg-primary border-primary-edge' : 'bg-border border-border'
      )}
    >
      <span
        className="inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(0)' }}
      />
    </button>
  );
}