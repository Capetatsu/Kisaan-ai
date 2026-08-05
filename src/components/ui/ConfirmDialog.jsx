import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, TriangleAlert } from 'lucide-react';

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!loading) onOpenChange(o); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <span className="grid place-items-center h-11 w-11 rounded-2xl bg-destructive/12 text-destructive shrink-0 mb-1">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" size="lg" disabled={loading} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
