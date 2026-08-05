import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import FarmFormDialog from '@/components/farms/FarmFormDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useLang } from '@/lib/languageContext';
import {
  Plus, MapPin, Pencil, Trash2, ChevronRight, RefreshCw, Sprout,
  Mountain, Ruler,
} from 'lucide-react';

const soilEmoji = {
  black: '🖤', red: '🔴', alluvial: '🟤', loamy: '🟢', clay: '🟣', sandy: '🟡',
};

const soilKey = (soilType) => (soilType || '').toLowerCase();

export default function Farms() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadFarms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFarms();
      setFarms(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms, lang]);

  const handleSaved = (saved) => {
    toast({
      title: editing ? 'Farm updated' : 'Farm created',
      description: `"${saved.name}" has been saved.`,
    });
    setEditing(null);
    loadFarms();
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (farm) => {
    setEditing(farm);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.deleteFarm(deleting.id);
      toast({ title: 'Farm deleted', description: `"${deleting.name}" has been removed.` });
      setDeleting(null);
      loadFarms();
    } catch (e) {
      toast({ title: 'Delete failed', description: e.message, variant: 'destructive' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl glass p-4 animate-pulse">
              <div className="h-4 w-1/3 bg-muted rounded-full mb-3" />
              <div className="h-3 w-2/3 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <GlassCard className="p-6 text-center animate-fade-up">
          <MapPin className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={loadFarms}>
            <RefreshCw className="h-4 w-4 mr-1" /> {t('retry')}
          </Button>
        </GlassCard>
      );
    }

    if (farms.length === 0) {
      return (
        <GlassCard strong className="p-8 text-center animate-fade-up">
          <span className="grid place-items-center h-16 w-16 rounded-3xl bg-primary/12 text-primary mx-auto mb-4">
            <Sprout className="h-8 w-8" />
          </span>
          <h2 className="text-lg font-bold font-heading">
            {isHindi ? 'अभी कोई फार्म नहीं' : 'No farms yet'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-[260px] mx-auto">
            {isHindi
              ? 'अपना पहला फार्म जोड़कर शुरुआत करें'
              : 'Add your first farm to start managing your crops'}
          </p>
          <Button className="mt-5" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            {isHindi ? 'फार्म जोड़ें' : 'Add farm'}
          </Button>
        </GlassCard>
      );
    }

    return (
      <div className="space-y-3">
        {farms.map((farm, index) => (
          <GlassCard key={farm.id} className="p-4 animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/12 text-2xl shrink-0">
                {soilEmoji[soilKey(farm.soil_type)] || '🌱'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{farm.name}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                  <span className="inline-flex items-center gap-1"><Mountain className="h-3 w-3" />{farm.soil_type}</span>
                  <span className="inline-flex items-center gap-1"><Ruler className="h-3 w-3" />{farm.area}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{farm.latitude}, {farm.longitude}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Link to={`/farms/${farm.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  {isHindi ? 'खोलें' : 'Open'} <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={() => openEdit(farm)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleting(farm)} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-4">
      <PageHeader title={isHindi ? 'मेरे फार्म' : 'My farms'} subtitle={farms.length ? `${farms.length} ${isHindi ? 'फार्म' : 'farms'}` : ''} />

      {!loading && !error && farms.length > 0 && (
        <Button className="w-full" onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1.5" />
          {isHindi ? 'फार्म जोड़ें' : 'Add farm'}
        </Button>
      )}

      {renderBody()}

      <FarmFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        farm={editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => { if (!deleteLoading) setDeleting(o ? deleting : null); }}
        title={isHindi ? 'फार्म हटाएं?' : 'Delete farm?'}
        description={
          isHindi
            ? `"${deleting?.name}" और इसके सभी फसल स्थायी रूप से हट जाएंगे।`
            : `"${deleting?.name}" and all its crops will be permanently deleted.`
        }
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
