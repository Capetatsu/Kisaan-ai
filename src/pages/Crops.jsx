import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { Sprout, Droplets, Bug, ArrowRight, Camera, Droplet, Cloud, Scissors, Leaf, Plus } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { Image } from '@/components/ui/image';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';

const waterTone = { low: 'green', medium: 'amber', high: 'red' };
const diseaseTone = { low: 'green', medium: 'amber', high: 'red' };

const quickActions = [
  { key: 'check_leaf', Icon: Camera, tone: 'primary' },
  { key: 'water_now', Icon: Droplet, tone: 'accent' },
  { key: 'spray_tomorrow', Icon: Cloud, tone: 'amber' },
  { key: 'harvest_soon', Icon: Scissors, tone: 'green' },
];

const cropEmojis = {
  wheat: '🌾', tomato: '🍅', onion: '🧅', soybean: '🫘',
  rice: '🌾', maize: '🌽', cotton: '🌿', sugarcane: '🎋',
  potato: '🥔', chilli: '🌶️', mustard: '🌼', groundnut: '🥜',
};

const cropEmojisHi = {
  गेहूं: '🌾', टमाटर: '🍅', प्याज: '🧅', सोयाबीन: '🫘',
  चावल: '🌾', मक्का: '🌽', कपास: '🌿', गन्ना: '🎋',
  आलू: '🥔', मिर्च: '🌶️', सरसों: '🌼', मूंगफली: '🥜',
};

export default function Crops() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [crops, setCrops] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const farms = await api.getFarms();
        if (farms.length === 0) {
          setCrops([]);
          return;
        }
        const allCrops = [];
        for (const farm of farms) {
          const farmCrops = await api.getCrops(farm.id);
          allCrops.push(...farmCrops.map((c) => ({
            ...c,
            farmId: farm.id,
            emoji: cropEmojis[c.name.toLowerCase()] || cropEmojisHi[c.name] || '🌱',
            health: c.status === 'HARVESTED' ? 100 : c.status === 'GROWING' ? 75 : 50,
            water: c.status === 'HARVESTED' ? 'low' : 'medium',
            disease: c.status === 'GROWING' ? 'low' : 'medium',
            nextAction: c.status === 'PLANTED' ? 'Water now' : c.status === 'GROWING' ? 'Check leaf' : 'Harvest soon',
            stage: c.status,
          })));
        }
        setCrops(allCrops);
        if (allCrops.length > 0) setActiveId(allCrops[0].id);
      } catch (e) {
        console.error('Failed to load crops:', e);
        if (e.message && e.message.includes('401')) {
          setAuthError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadCrops();
  }, []);

  const active = crops.find((c) => c.id === activeId);

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('my_crops')} subtitle={isHindi ? 'फसलें सक्रिय' : 'crops active'} />
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('my_crops')} subtitle={isHindi ? 'लॉगिन आवश्यक' : 'login required'} />
        <GlassCard className="p-6 text-center">
          <Sprout className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-semibold">{isHindi ? 'लॉगिन करें' : 'Please login'}</p>
          <p className="text-xs text-muted-foreground mt-1">{isHindi ? 'अपनी फसलें देखने के लिए लॉगिन करें' : 'Login to view your crops and farms'}</p>
        </GlassCard>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('my_crops')} subtitle={isHindi ? 'कोई फसल नहीं' : 'no crops'} />
        <GlassCard className="p-6 text-center">
          <Sprout className="h-8 w-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-semibold">{isHindi ? 'अभी कोई फसल नहीं' : 'No crops yet'}</p>
          <p className="text-xs text-muted-foreground mt-1">{isHindi ? 'पहले एक फार्म बनाएं और फसल जोड़ें' : 'Create a farm first, then add crops'}</p>
          <Link to="/farms" className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground active:scale-95 transition-transform">
            <Plus className="h-4 w-4" />
            {isHindi ? 'फार्म जोड़ें' : 'Manage farms'}
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title={t('my_crops')} subtitle={`${crops.length} ${isHindi ? 'फसलें सक्रिय' : 'crops active'}`} />

      {/* Crop selector chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {crops.map((c) => (
          <button key={c.id} onClick={() => setActiveId(c.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all tap-target
              ${c.id === activeId ? 'bg-primary text-primary-foreground' : 'glass text-foreground'}`}>
            <span>{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Active crop hero with image */}
      <GlassCard strong className="overflow-hidden animate-fade-up">
        <div className="relative h-24">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
            alt=""
            fittingType="fill"
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
          <div className="absolute bottom-2.5 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-3xl drop-shadow-lg shrink-0">{active.emoji}</span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold font-heading text-white drop-shadow truncate">{active.name}</h2>
                <p className="text-xs text-white/80 drop-shadow">{active.stage}</p>
              </div>
            </div>
            <StatusChip tone={active.health >= 80 ? 'green' : active.health >= 60 ? 'amber' : 'red'}>
              {active.health}%
            </StatusChip>
          </div>
        </div>
        <div className="p-4">
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full ${active.health >= 80 ? 'bg-primary' : active.health >= 60 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${active.health}%` }} />
          </div>
        </div>
      </GlassCard>

      {/* Status grid */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 text-center animate-fade-up">
          <Sprout className="h-5 w-5 text-primary mx-auto mb-1.5" />
          <p className="text-[10px] text-muted-foreground">{t('crop_health')}</p>
          <p className="text-base font-bold">{active.health}%</p>
        </GlassCard>
        <GlassCard className="p-4 text-center animate-fade-up">
          <Droplets className="h-5 w-5 text-primary mx-auto mb-1.5" />
          <p className="text-[10px] text-muted-foreground">{t('water_need')}</p>
          <p className="text-base font-bold capitalize">{t(active.water)}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center animate-fade-up">
          <Bug className="h-5 w-5 text-primary mx-auto mb-1.5" />
          <p className="text-[10px] text-muted-foreground">{t('disease_risk')}</p>
          <p className="text-base font-bold capitalize">{t(active.disease)}</p>
        </GlassCard>
      </div>

      {/* Next action */}
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up" glow>
        <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-primary-foreground shrink-0">
          <ArrowRight className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{t('next_action')}</p>
          <p className="font-bold">{active.nextAction}</p>
        </div>
        <StatusChip tone={diseaseTone[active.disease]} pulse>{t(active.disease)} {isHindi ? 'जोखिम' : 'risk'}</StatusChip>
      </GlassCard>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map(({ key, Icon }) => (
          <button key={key}>
            <GlassCard className="p-4 flex items-center gap-3 animate-fade-up active:scale-[0.97] transition-transform">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/12 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-semibold text-sm">{t(key)}</span>
            </GlassCard>
          </button>
        ))}
      </div>

      {/* Leaf check hint */}
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <Leaf className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">{isHindi ? 'पत्ती पर धब्बे? फोटो खींचें और एआई से पूछें।' : 'Spots on leaves? Snap a photo and ask AI.'}</p>
      </GlassCard>
    </div>
  );
}