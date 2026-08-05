import React, { useEffect, useState } from 'react';
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
import { Loader2, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { useLang } from '@/lib/languageContext';

const EMPTY = { name: '', soil_type: '', area: '', latitude: '', longitude: '' };

const validators = {
  name: (v) => !v.trim() && 'Farm name is required',
  soil_type: (v) => !v.trim() && 'Soil type is required',
  area: (v) => {
    if (v.trim() === '') return 'Area is required';
    const n = Number(v);
    if (Number.isNaN(n)) return 'Area must be a number';
    if (n <= 0) return 'Area must be greater than 0';
    return '';
  },
  latitude: (v) => {
    if (v.trim() === '') return 'Latitude is required';
    const n = Number(v);
    if (Number.isNaN(n)) return 'Latitude must be a number';
    if (n < -90 || n > 90) return 'Latitude must be between -90 and 90';
    return '';
  },
  longitude: (v) => {
    if (v.trim() === '') return 'Longitude is required';
    const n = Number(v);
    if (Number.isNaN(n)) return 'Longitude must be a number';
    if (n < -180 || n > 180) return 'Longitude must be between -180 and 180';
    return '';
  },
};

export default function FarmFormDialog({ open, onOpenChange, farm = null, onSaved }) {
  const { lang } = useLang();
  const isHindi = lang === 'hi';
  const isEdit = Boolean(farm);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (open) {
      setValues(
        farm
          ? {
              name: farm.name ?? '',
              soil_type: farm.soil_type ?? '',
              area: farm.area ?? '',
              latitude: farm.latitude ?? '',
              longitude: farm.longitude ?? '',
            }
          : EMPTY
      );
      setErrors({});
      setFormError(null);
    }
  }, [open, farm]);

  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError(null);
  };

  const validate = () => {
    const next = {};
    for (const key of Object.keys(values)) {
      const msg = validators[key]?.(values[key]);
      if (msg) next[key] = msg;
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
      soil_type: values.soil_type.trim(),
      area: Number(values.area),
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    };

    setSaving(true);
    setFormError(null);
    try {
      const saved = isEdit
        ? await api.updateFarm(farm.id, payload)
        : await api.createFarm(payload);
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!saving) onOpenChange(o); }}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <span className="grid place-items-center h-11 w-11 rounded-2xl bg-primary/12 text-primary shrink-0 mb-1">
            <MapPin className="h-5 w-5" />
          </span>
          <DialogTitle>
            {isEdit
              ? (isHindi ? 'फार्म अपडेट करें' : 'Update farm')
              : (isHindi ? 'नया फार्म जोड़ें' : 'Add new farm')}
          </DialogTitle>
          <DialogDescription>
            {isHindi
              ? 'अपने फार्म का विवरण भरें'
              : 'Enter the details of your farm'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormField label="Farm name" required error={errors.name}>
            <Input
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="e.g. North field"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Soil type" required error={errors.soil_type}>
            <Input
              value={values.soil_type}
              onChange={(e) => setField('soil_type', e.target.value)}
              placeholder="e.g. Black / Alluvial / Loamy"
              autoComplete="off"
            />
          </FormField>

          <FormField label="Area" required error={errors.area} hint="In acres or hectares">
            <Input
              type="number"
              step="any"
              min="0"
              inputMode="decimal"
              value={values.area}
              onChange={(e) => setField('area', e.target.value)}
              placeholder="e.g. 2.5"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Latitude" required error={errors.latitude}>
              <Input
                type="number"
                step="any"
                inputMode="decimal"
                value={values.latitude}
                onChange={(e) => setField('latitude', e.target.value)}
                placeholder="e.g. 22.7196"
              />
            </FormField>
            <FormField label="Longitude" required error={errors.longitude}>
              <Input
                type="number"
                step="any"
                inputMode="decimal"
                value={values.longitude}
                onChange={(e) => setField('longitude', e.target.value)}
                placeholder="e.g. 75.8577"
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
                  : (isHindi ? 'जोड़ें' : 'Add farm'))}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
