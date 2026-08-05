import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import CropFormDialog from '@/components/crops/CropFormDialog';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useLang } from '@/lib/languageContext';
import {
  ArrowLeft, Plus, Pencil, Trash2, RefreshCw, Sprout, Mountain, Ruler,
  MapPin, Calendar, RefreshCcw,
} from 'lucide-react';

const cropEmojis = {
  wheat: '🌾', tomato: '🍅', onion: '🧅', soybean: '🫘',
  rice: '🌾', paddy: '🌾', maize: '🌽', cotton: '🌿', sugarcane: '🎋',
  potato: '🥔', chilli: '🌶️', mustard: '🌼', groundnut: '🥜', barley: '🌾',
};

const seasonLabels = {
  KHARIF: 'Kharif',
  RABI: 'Rabi',
  ZAID: 'Zaid',
};

export default function FarmDetail() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const isHindi = lang === 'hi';

  const [farm, setFarm] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [farmData, cropsData] = await Promise.all([
        api.getFarm(farmId),
        api.getCrops(farmId),
      ]);
      setFarm(farmData);
      setCrops(Array.isArray(cropsData) ? cropsData : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    loadData();
  }, [loadData, lang]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (crop) => {
    setEditing(crop);
    setFormOpen(true);
  };

  const handleCropSaved = (saved) => {
    toast({
      title: editing ? 'Crop updated' : 'Crop added',
      description: `"${saved.name}" has been saved.`,
    });
    setEditing(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.deleteCrop(farmId, deleting.id);
      toast({ title: 'Crop deleted', description: `"${deleting.name}" has been removed.` });
      setDeleting(null);
      loadData();
    } catch (e) {
      toast({ title: 'Delete failed', description: e.message, variant: 'destructive' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusTone = (status) => {
    if (status === 'HARVESTED') return 'muted';
    if (status === 'GROWING') return 'green';
    return 'amber';
  };

  const renderLoading = () => (
    <div className="space-y-3">
      <div className="rounded-2xl glass p-4 animate-pulse">
        <div className="h-4 w-1/3 bg-muted rounded-full mb-3" />
        <div className="h-3 w-2/3 bg-muted rounded-full" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl glass p-4 animate-pulse">
          <div className="h-4 w-1/2 bg-muted rounded-full mb-3" />
          <div className="h-3 w-1/3 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-2 pt-3">
        <button onClick={() => navigate(-1)} className="grid place-items-center h-9 w-9 rounded-full glass active:scale-90 transition-transform" aria-label="Back">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold font-heading truncate">{farm?.name || (isHindi ? 'फार्म' : 'Farm')}</h1>
          <p className="text-[11px] text-muted-foreground truncate">{isHindi ? 'फार्म विवरण' : 'farm details'}</p>
        </div>
      </div>

      {loading && renderLoading()}

      {!loading && error && (
        <GlassCard className="p-6 text-center animate-fade-up">
          <MapPin className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-1" /> {isHindi ? 'पुनः प्रयास करें' : 'Retry'}
          </Button>
        </GlassCard>
      )}

      {!loading && !error && farm && (
        <>
          {/* Farm summary */}
          <GlassCard strong className="p-4 animate-fade-up">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary/12 text-primary shrink-0"><Mountain className="h-4.5 w-4.5" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Soil</p>
                  <p className="text-sm font-bold capitalize truncate">{farm.soil_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary/12 text-primary shrink-0"><Ruler className="h-4.5 w-4.5" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Area</p>
                  <p className="text-sm font-bold truncate">{farm.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary/12 text-primary shrink-0"><MapPin className="h-4.5 w-4.5" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground">Location</p>
                  <p className="text-sm font-bold truncate">{farm.latitude}, {farm.longitude}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {isHindi ? 'फसलें' : 'Crops'}
              {crops.length > 0 && <span className="text-muted-foreground font-medium"> · {crops.length}</span>}
            </h2>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" /> {isHindi ? 'फसल जोड़ें' : 'Add crop'}
            </Button>
          </div>

          {crops.length === 0 ? (
            <GlassCard className="p-8 text-center animate-fade-up">
              <span className="grid place-items-center h-16 w-16 rounded-3xl bg-primary/12 text-primary mx-auto mb-4">
                <Sprout className="h-8 w-8" />
              </span>
              <h3 className="text-lg font-bold font-heading">{isHindi ? 'कोई फसल नहीं' : 'No crops yet'}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[260px] mx-auto">
                {isHindi ? 'इस फार्म में अपनी पहली फसल जोड़ें' : 'Add your first crop to this farm'}
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {crops.map((crop, index) => (
                <GlassCard key={crop.id} className="p-4 animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary/12 text-2xl shrink-0">
                      {cropEmojis[crop.name.toLowerCase()] || '🌱'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold truncate">{crop.name}</p>
                        <StatusChip tone={statusTone(crop.status)}>{crop.status}</StatusChip>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                        <span className="inline-flex items-center gap-1"><RefreshCcw className="h-3 w-3" />{seasonLabels[crop.season] || crop.season}</span>
                        {crop.variety && <span className="truncate">· {crop.variety}</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Planted {crop.planted_at}</span>
                        {crop.expected_harvest && <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Harvest {crop.expected_harvest}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(crop)}>
                      <Pencil className="h-4 w-4 mr-1" /> {isHindi ? 'संपादित करें' : 'Edit'}
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleting(crop)}>
                      <Trash2 className="h-4 w-4" /> {isHindi ? 'हटाएं' : 'Delete'}
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/farms" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> {isHindi ? 'फार्म पर वापस जाएं' : 'Back to farms'}
            </Link>
          </div>
        </>
      )}

      <CropFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        farmId={Number(farmId)}
        crop={editing}
        onSaved={handleCropSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => { if (!deleteLoading) setDeleting(o ? deleting : null); }}
        title={isHindi ? 'फसल हटाएं?' : 'Delete crop?'}
        description={
          isHindi
            ? `"${deleting?.name}" स्थायी रूप से हट जाएगा।`
            : `"${deleting?.name}" will be permanently deleted.`
        }
        loading={deleteLoading}
        onConfirm={handleDelete}
      />
    </div>
  );
}