import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import { TrendingUp, TrendingDown, Minus, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { api } from '@/lib/api';
import { animateCount, animateStaggerEntrance, prefersReducedMotion } from '@/lib/animation';

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendColor = { up: 'text-primary', down: 'text-berry', flat: 'text-muted-foreground' };
const suggTone = { sell: 'green', hold: 'sun', buy: 'accent' };
const suggCard = {
  sell: 'border-primary bg-primary/10 text-primary',
  hold: 'border-sun bg-sun/10 text-sun',
  buy: 'border-accent bg-accent/10 text-accent',
};
const suggText = { sell: 'text-primary', hold: 'text-sun', buy: 'text-accent' };

const normalizeTrend = (t) => (['up', 'down', 'flat'].includes(t) ? t : 'flat');
const normalizeSuggestion = (s) => (['sell', 'hold', 'buy'].includes(s) ? s : 'hold');

function PriceCounter({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    animateCount(null, 0, value, { duration: 900, onUpdate: setDisplay });
  }, [value]);

  return <>₹{display}</>;
}

function TrendArrow({ trend }) {
  const Icon = trendIcon[trend];
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(false);
    const t = setTimeout(() => setBounce(true), 50);
    return () => clearTimeout(t);
  }, [trend]);

  return (
    <span className={`inline-flex items-center gap-1 ${bounce ? 'animate-trend-bounce' : ''}`}>
      <Icon className="h-4 w-4" strokeWidth={2.8} />
    </span>
  );
}

export default function Market() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [marketData, setMarketData] = useState([]);
  const [nearbyMandi, setNearbyMandi] = useState({ name: 'Sanwer Mandi', distance: '8 km', open: true });
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const cropListRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (cropListRef.current) animateStaggerEntrance(cropListRef.current.children, { delay: 50, start: 200 });
  }, [marketData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prices, mandi] = await Promise.all([
          api.getMarketPrices(),
          api.getNearbyMandi(),
        ]);
        const normalized = (Array.isArray(prices) ? prices : []).map((p) => ({
          ...p,
          trend: normalizeTrend(p.trend),
          suggestion: normalizeSuggestion(p.suggestion),
        }));
        setMarketData(normalized);
        setNearbyMandi(mandi);
        if (normalized.length > 0) setActiveId(normalized[2]?.id || normalized[0].id);
      } catch (e) {
        console.error('Failed to load market data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const active = marketData.find((m) => m.id === activeId) || marketData[0];

  if (loading) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('nav_market')} subtitle={nearbyMandi.name} />
        <div className="fixed inset-0 flex items-center justify-center">
          <span className="w-10 h-10 rounded-full border-4 border-border border-t-water animate-spin" />
        </div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('nav_market')} subtitle={nearbyMandi.name} />
        <GlassCard className="p-6 text-center animate-scale-in">
          <KisaanMascot mood="confused" className="w-24 h-24 mx-auto mb-2" />
          <p className="text-sm font-extrabold text-muted-foreground">{isHindi ? 'कोई मंडी डेटा उपलब्ध नहीं' : 'No market data available'}</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title={t('nav_market')} subtitle={nearbyMandi.name} />

      {/* Hero — big blue price section */}
      <div className="rounded-3xl overflow-hidden border-4 text-white relative animate-fade-up"
        style={{ backgroundColor: 'hsl(var(--hero-water))', borderColor: 'hsl(var(--water-edge))' }}>
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">{t('current_price')}</p>
              <p className="text-2xl font-extrabold mt-1">{isHindi ? active.cropHi : active.crop} {active.emoji}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-5xl font-extrabold font-heading leading-none drop-shadow-sm">
                  <PriceCounter value={active.price} />
                </span>
                <span className="text-sm font-bold text-white/80 mt-auto mb-0.5">/{active.unit}</span>
              </div>
            </div>
            <div className="w-20 h-20 shrink-0">
              <KisaanMascot mood="celebrating" className="w-full h-full drop-shadow animate-float-soft" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-extrabold border-2 border-white/40 bg-white/20 ${trendColor[active.trend]}`}>
              <TrendArrow trend={active.trend} />
              {active.change}% {isHindi ? 'आज' : 'today'}
            </span>
            <span className={`inline-flex items-center rounded-full border-2 border-white/40 bg-white px-3 py-1 text-sm font-extrabold ${suggText[active.suggestion]}`}>
              {t(active.suggestion).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Suggestion — colored action card */}
      <div className={`rounded-2xl border-[3px] p-4 flex items-center gap-3 animate-fade-up stagger-2 ${suggCard[active.suggestion]}`}>
        <span className="grid place-items-center h-12 w-12 rounded-xl bg-white shrink-0 border-2 border-current">
          <ArrowRight className="h-6 w-6" strokeWidth={2.8} />
        </span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wide opacity-70">{t('suggestion')}</p>
          <p className="text-xl font-extrabold capitalize">{t(active.suggestion)} {active.suggestion === 'sell' ? (isHindi ? 'अभी' : 'now') : ''}</p>
        </div>
        <StatusChip tone={suggTone[active.suggestion]} className="bg-white">{t(active.suggestion).toUpperCase()}</StatusChip>
      </div>

      {/* Best sell time + mandi */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4 flex flex-col gap-2 animate-fade-up stagger-3">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-sun/20 text-sun shrink-0">
            <Clock className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground font-bold">{t('best_sell')}</p>
            <p className="font-extrabold text-sm">{isHindi ? 'आज शाम 4–6 बजे' : 'Today, 4–6 PM'}</p>
          </div>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col gap-2 animate-fade-up stagger-4">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/12 text-primary shrink-0">
            <MapPin className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div>
            <p className="text-xs text-muted-foreground font-bold">{t('nearby_mandi')}</p>
            <p className="font-extrabold text-sm truncate">{nearbyMandi.name} · {nearbyMandi.distance}</p>
          </div>
          <StatusChip tone={nearbyMandi.open ? 'green' : 'muted'}>{nearbyMandi.open ? (isHindi ? 'खुला' : 'Open') : (isHindi ? 'बंद' : 'Closed')}</StatusChip>
        </GlassCard>
      </div>

      {/* All crops list — scroll-reveal stagger */}
      <p className="text-xs font-extrabold text-muted-foreground px-1">{isHindi ? 'सभी फसलें' : 'All crops'}</p>
      <div className="space-y-2.5" ref={cropListRef}>
        {marketData.map((m) => {
          const TI = trendIcon[m.trend];
          return (
            <button key={m.id} onClick={() => setActiveId(m.id)} className="w-full text-left">
              <GlassCard className={`p-3.5 flex items-center gap-3 transition-all border-2 ${m.id === activeId ? 'glow border-water' : ''}`}>
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-muted text-2xl shrink-0">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-sm">{isHindi ? m.cropHi : m.crop}</p>
                  <p className="text-xs text-muted-foreground font-bold">₹{m.price}/{m.unit}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-extrabold ${trendColor[m.trend]}`}>
                  <TI className="h-4 w-4" strokeWidth={2.6} />{m.change}%
                </div>
                <StatusChip tone={suggTone[m.suggestion]} className="hidden sm:inline-flex">{t(m.suggestion)}</StatusChip>
              </GlassCard>
            </button>
          );
        })}
      </div>
    </div>
  );
}
