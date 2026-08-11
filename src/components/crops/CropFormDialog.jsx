import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormField from '@/components/ui/form-field';
import { Loader2, Sprout } from 'lucide-react';
import { api } from '@/lib/api';
import { useLang } from '@/lib/languageContext';
import { animateSuccessBurst, prefersReducedMotion } from '@/lib/animation';

const SEASONS = ['KHARIF', 'RABI', 'ZAID'];
const STATUSES = ['PLANTED', 'GROWING', 'HARVESTED'];

const EMPTY = {
  name: '',
  variety: '',
  season: 'KHARIF',
  planted_at: '',
  expected_harvest: '',
  status: 'PLANTED',
};

const validateField = (key, value) => {
  switch (key) {
    case 'name':
      return !value.trim() ? 'Crop name is required' : '';
    case 'season':
      return !SEASONS.includes(value) ? 'Select a valid season' : '';
    case 'status':
      return !STATUSES.includes(value) ? 'Select a valid status' : '';
    case 'planted_at':
      return !value ? 'Planted date is required' : '';
    default:
      return '';
  }
};

export default function CropFormDialog({ open, onOpenChange, farmId, crop = null, onSaved }) {
  const { lang } = useLang();
  const isHindi = lang === 'hi';
  const isEdit = Boolean(crop);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const successRef = useRef(null);

  useEffect(() => {
    if (open) {
      setValues(
        crop
          ? {
              name: crop.name ?? '',
              variety: crop.variety ?? '',
              season: crop.season ?? 'KHARIF',
              planted_at: crop.planted_at ?? '',
              expected_harvest: crop.expected_harvest ?? '',
              status: crop.status ?? 'PLANTED',
            }
          : EMPTY
      );
      setErrors({});
      setFormError(null);
    }
  }, [open, crop]);

  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const validate = () => {
    const next = {};
    for (const key of ['name', 'season', 'status', 'planted_at']) {
      const msg = validateField(key, values[key]);
      if (msg) next[key] = msg;
    }
    if (
      values.expected_harvest &&
      values.planted_at &&
      values.expected_harvest < values.planted_at
    ) {
      next.expected_harvest = 'Expected harvest cannot be before the planted date';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    const payload = {
      name: values.name.trim(),
      variety: values.variety.trim() || null,
      season: values.season,
      planted_at: values.planted_at,
      expected_harvest: values.expected_harvest || null,
      status: values.status,
    };

    setSaving(true);
    setFormError(null);
    try {
      const saved = isEdit
        ? await api.updateCrop(farmId, crop.id, payload)
        : await api.createCrop(farmId, payload);
      if (!prefersReducedMotion()) {
        animateSuccessBurst(successRef.current);
      }
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectCls =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!saving) onOpenChange(o); }}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <span ref={successRef} className="grid place-items-center h-11 w-11 rounded-2xl bg-primary/12 text-primary shrink-0 mb-1">
            <Sprout className="h-5 w-5" />
          </span>
          <DialogTitle>
            {isEdit
              ? (isHindi ? 'फसल अपडेट करें' : 'Update crop')
              : (isHindi ? 'फसल जोड़ें' : 'Add crop')}
          </DialogTitle>
          <DialogDescription>
            {isHindi ? 'अपनी फसल का विवरण भरें' : 'Enter the details of your crop'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormField label="Crop name" required error={errors.name}>
            <Input
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. Wheat / Soybean"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Variety" error={errors.variety}>
            <Input
              value={values.variety}
              onChange={(e) => setField('variety', e.target.value)}
              placeholder="e.g. HD-2967"
              autoComplete="off"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Season" required error={errors.season}>
              <select
                className={selectCls}
                value={values.season}
                onChange={(e) => setField('season', e.target.value)}
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Status" required error={errors.status}>
              <select
                className={selectCls}
                value={values.status}
                onChange={(e) => setField('status', e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Planted date" required error={errors.planted_at}>
              <Input
                id="planted_at"
                type="date"
                value={values.planted_at}
                onChange={(e) => setField('planted_at', e.target.value)}
              />
            </FormField>
            <FormField label="Expected harvest" error={errors.expected_harvest}>
              <Input
                type="date"
                value={values.expected_harvest}
                onChange={(e) => setField('expected_harvest', e.target.value)}
              />
            </FormField>
          </div>

          {formError && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-sm font-medium px-3.5 py-2.5">
              {formError}
            </div>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" size="lg" disabled={saving} onClick={() => onOpenChange(false)}>
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button type="submit" size="lg" disabled={saving} onClick={handleSubmit}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving
              ? (isHindi ? 'सहेजा जा रहा है…' : 'Saving…')
              : (isEdit
                  ? (isHindi ? 'अपडेट करें' : 'Update')
                  : (isHindi ? 'जोड़ें' : 'Add crop'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
