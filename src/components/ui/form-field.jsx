import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function FormField({ label, error, hint, required, className, children }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label className="text-xs font-semibold text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
