import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import CropBackground from '@/components/mascot/CropBackground';
import AnimatedProgressBar from '@/components/ui/AnimatedProgressBar';
import { Sprout, Droplets, Bug, Camera, Droplet, Cloud, Scissors, Leaf, Plus, ChevronRight } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { api } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { animateCount, animateStaggerEntrance, prefersReducedMotion } from '@/lib/animation';

const diseaseTone = { low: 'green', medium: 'amber', high: 'red' };

const quickActions = [
  { key: 'check_leaf', Icon: Camera, cls: 'bg-water/12 text-water', nav: '/ai' },
  { key: 'water_now', Icon: Droplet, cls: 'bg-water/12 text-water' },
  { key: 'spray_tomorrow', Icon: Cloud, cls: 'bg-tangerine/12 text-tangerine' },
  { key: 'harvest_soon', Icon: Scissors, cls: 'bg-primary/12 text-primary' },
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

function HealthCounter({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    animateCount(null, 0, value, { duration: 800, onUpdate: setDisplay });
  }, [value]);

  return <span className="text-4xl font-extrabold font-heading drop-shadow-sm">{display}%</span>;
}

export default function Crops() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const isHindi = lang === 'hi';
  const [crops, setCrops] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const cardsRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (cardsRef.current) animateStaggerEntrance(cardsRef.current.children, { delay: 70, start: 100 });
    if (actionsRef.current) animateStaggerEntrance(actionsRef.current.children, { delay: 60, start: 150 });
  }, [crops, activeId]);

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
        if (e.status === 401) {
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
          <span className="w-10 h-10 rounded-full border-4 border-border border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('my_crops')} subtitle={isHindi ? 'लॉगिन आवश्यक' : 'login required'} />
        <GlassCard className="p-6 text-center animate-scale-in">
          <KisaanMascot mood="confused" className="w-24 h-24 mx-auto mb-2" />
          <p className="text-base font-extrabold">{isHindi ? 'लॉगिन करें' : 'Please login'}</p>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">{isHindi ? 'अपनी फसलें देखने के लिए लॉगिन करें' : 'Login to view your crops and farms'}</p>
        </GlassCard>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('my_crops')} subtitle={isHindi ? 'कोई फसल नहीं' : 'no crops'} />
        <GlassCard className="p-6 text-center animate-scale-in">
          <KisaanMascot mood="growing" className="w-28 h-28 mx-auto mb-2 animate-float-soft" />
          <p className="text-base font-extrabold">{isHindi ? 'अभी कोई फसल नहीं' : 'No crops yet'}</p>
          <p className="text-xs text-muted-foreground mt-1 font-semibold">{isHindi ? 'पहले एक फार्म बनाएं और फसल जोड़ें' : 'Create a farm first, then add crops'}</p>
          <Link to="/farms" className="mt-4 btn-duo btn-leaf h-12 px-6">
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
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all tap-target animate-chip-slide
              ${c.id === activeId ? 'bg-primary text-white border-2 border-primary-edge shadow-duo' : 'glass text-foreground'}`}
            style={{ animationDelay: `${crops.indexOf(c) * 0.05}s` }}>
            <span className="text-lg">{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Crop hero — big green section */}
      <div className="rounded-3xl overflow-hidden border-4 text-white relative animate-fade-up"
        style={{ backgroundColor: 'hsl(var(--hero-primary))', borderColor: 'hsl(var(--primary-edge))' }}>
        <CropBackground cropName={active.name} />
        <div className="px-5 pt-5 pb-4 relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">{t('crop_health')}</p>
              <h2 className="text-3xl font-extrabold font-heading truncate drop-shadow-sm mt-0.5">{active.emoji} {active.name}</h2>
              <p className="text-sm font-bold text-white/85 capitalize mt-0.5">{active.stage}</p>
            </div>
            <div className="w-24 h-24 shrink-0">
              <KisaanMascot mood={active.health >= 80 ? 'happy' : active.health >= 60 ? 'watering' : 'warning'} className="w-full h-full drop-shadow" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <HealthCounter value={active.health} />
            <AnimatedProgressBar value={active.health} color="sun" className="flex-1" style={{ background: 'rgba(255,255,255,0.25)' }} />
          </div>
        </div>
      </div>

      {/* Status grid — stagger reveal */}
      <div className="grid grid-cols-3 gap-3" ref={cardsRef}>
        <GlassCard className="p-4 text-center border-[3px] border-primary/25">
          <span className="mx-auto mb-1.5 grid place-items-center h-9 w-9 rounded-xl bg-primary/12 text-primary"><Sprout className="h-5 w-5" strokeWidth={2.5} /></span>
          <p className="text-[10px] text-muted-foreground font-bold">{t('crop_health')}</p>
          <p className="text-xl font-extrabold">{active.health}%</p>
        </GlassCard>
        <GlassCard className="p-4 text-center border-[3px] border-water/25">
          <span className="mx-auto mb-1.5 grid place-items-center h-9 w-9 rounded-xl bg-water/12 text-water"><Droplets className="h-5 w-5" strokeWidth={2.5} /></span>
          <p className="text-[10px] text-muted-foreground font-bold">{t('water_need')}</p>
          <p className="text-xl font-extrabold capitalize">{t(active.water)}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center border-[3px] border-berry/25">
          <span className="mx-auto mb-1.5 grid place-items-center h-9 w-9 rounded-xl bg-berry/12 text-berry"><Bug className="h-5 w-5" strokeWidth={2.5} /></span>
          <p className="text-[10px] text-muted-foreground font-bold">{t('disease_risk')}</p>
          <p className="text-xl font-extrabold capitalize">{t(active.disease)}</p>
        </GlassCard>
      </div>

      {/* Next action */}
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up glow border-[3px] border-primary/20">
        <span className="grid place-items-center h-12 w-12 rounded-xl bg-primary text-white shrink-0 shadow-duo">
          <ChevronRight className="h-6 w-6" strokeWidth={2.8} />
        </span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{t('next_action')}</p>
          <p className="font-extrabold text-base">{active.nextAction}</p>
        </div>
        <StatusChip tone={diseaseTone[active.disease]} pulse>{t(active.disease)} {isHindi ? 'जोखिम' : 'risk'}</StatusChip>
      </GlassCard>

      {/* Quick actions — stagger reveal */}
      <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wide px-1">{t('today_action')}</p>
      <div className="grid grid-cols-2 gap-3" ref={actionsRef}>
        {quickActions.map(({ key, Icon, cls, nav }) => (
          <button key={key} onClick={nav ? () => navigate(nav) : undefined}>
            <GlassCard className="p-4 flex items-center gap-3 active:scale-[0.97] transition-transform border-2">
              <span className={`grid place-items-center h-10 w-10 rounded-xl ${cls} shrink-0`}>
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-extrabold text-sm text-left leading-tight">{t(key)}</span>
            </GlassCard>
          </button>
        ))}
      </div>

      {/* Leaf check hint */}
      <div className="rounded-2xl p-4 flex items-center gap-3 animate-fade-up stagger-6 bg-accent/10 border-2 border-accent/25">
        <KisaanMascot mood="helping" className="w-14 h-14 shrink-0" />
        <p className="text-xs text-foreground font-bold leading-relaxed">{isHindi ? 'पत्ती पर धब्बे? फोटो खींचें और एआई से पूछें।' : 'Spots on leaves? Snap a photo and ask AI.'}</p>
        <Leaf className="h-5 w-5 text-accent shrink-0" strokeWidth={2.5} />
      </div>
    </div>
  );
}
