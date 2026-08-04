import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { TrendingUp, TrendingDown, Minus, MapPin, Clock, BadgeIndianRupee, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { api } from '@/lib/api';

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendColor = { up: 'text-primary', down: 'text-destructive', flat: 'text-muted-foreground' };
const suggTone = { sell: 'green', hold: 'amber', buy: 'accent' };

export default function Market() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [marketData, setMarketData] = useState([]);
  const [nearbyMandi, setNearbyMandi] = useState({ name: 'Sanwer Mandi', distance: '8 km', open: true });
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prices, mandi] = await Promise.all([
          api.getMarketPrices(),
          api.getNearbyMandi(),
        ]);
        setMarketData(prices);
        setNearbyMandi(mandi);
        if (prices.length > 0) setActiveId(prices[2]?.id || prices[0].id);
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
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="space-y-4">
        <PageHeader title={t('nav_market')} subtitle={nearbyMandi.name} />
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-muted-foreground">{isHindi ? 'कोई मंडी डेटा उपलब्ध नहीं' : 'No market data available'}</p>
        </GlassCard>
      </div>
    );
  }

  const TrendIcon = trendIcon[active.trend];

  return (
    <div className="space-y-4">
      <PageHeader title={t('nav_market')} subtitle={nearbyMandi.name} />

      {/* Hero price card */}
      <GlassCard strong className="p-6 text-center animate-fade-up" glow>
        <p className="text-xs font-semibold text-muted-foreground">{t('current_price')} · {isHindi ? active.cropHi : active.crop} {active.emoji}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <BadgeIndianRupee className="h-7 w-7 text-primary" />
          <span className="text-4xl font-bold font-heading">{active.price}</span>
          <span className="text-sm text-muted-foreground">/{active.unit}</span>
        </div>
        <div className={`inline-flex items-center gap-1 mt-3 text-sm font-bold ${trendColor[active.trend]}`}>
          <TrendIcon className="h-4 w-4" />
          {active.change}% {isHindi ? 'आज' : 'today'}
        </div>
      </GlassCard>

      {/* Suggestion */}
      <GlassCard className="p-5 flex items-center gap-4 animate-fade-up">
        <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary text-primary-foreground shrink-0">
          <ArrowRight className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{t('suggestion')}</p>
          <p className="text-xl font-bold capitalize">{t(active.suggestion)} {active.suggestion === 'sell' ? (isHindi ? 'अभी' : 'now') : ''}</p>
        </div>
        <StatusChip tone={suggTone[active.suggestion]} pulse>{t(active.suggestion).toUpperCase()}</StatusChip>
      </GlassCard>

      {/* Best sell time */}
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <span className="grid place-items-center h-10 w-10 rounded-xl bg-warning/15 text-warning shrink-0">
          <Clock className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{t('best_sell')}</p>
          <p className="font-bold">{isHindi ? 'आज शाम 4–6 बजे' : 'Today, 4–6 PM'}</p>
        </div>
      </GlassCard>

      {/* Nearby mandi */}
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/12 text-primary shrink-0">
          <MapPin className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{t('nearby_mandi')}</p>
          <p className="font-bold">{nearbyMandi.name} · {nearbyMandi.distance}</p>
        </div>
        <StatusChip tone={nearbyMandi.open ? 'green' : 'muted'}>{nearbyMandi.open ? (isHindi ? 'खुला' : 'Open') : (isHindi ? 'बंद' : 'Closed')}</StatusChip>
      </GlassCard>

      {/* All crops list */}
      <p className="text-xs font-semibold text-muted-foreground px-1">{isHindi ? 'सभी फसलें' : 'All crops'}</p>
      <div className="space-y-2">
        {marketData.map((m) => {
          const TI = trendIcon[m.trend];
          return (
            <button key={m.id} onClick={() => setActiveId(m.id)} className="w-full text-left">
              <GlassCard className={`p-3.5 flex items-center gap-3 transition-all ${m.id === activeId ? 'glow-ring' : ''}`}>
                <span className="text-2xl">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{isHindi ? m.cropHi : m.crop}</p>
                  <p className="text-xs text-muted-foreground">₹{m.price}/{m.unit}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${trendColor[m.trend]}`}>
                  <TI className="h-4 w-4" />{m.change}%
                </div>
                <StatusChip tone={suggTone[m.suggestion]}>{t(m.suggestion)}</StatusChip>
              </GlassCard>
            </button>
          );
        })}
      </div>
    </div>
  );
}