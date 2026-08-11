import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import { TrendingUp, Sprout, Droplets } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { analytics } from '@/lib/mockData';

function MiniBar({ data, color }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="flex items-end justify-between gap-2 h-24">
      {data.map((d, i) => (
        <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full rounded-lg bg-muted overflow-hidden flex items-end h-full">
            <div
              className={`w-full rounded-lg animate-bar-grow ${color}`}
              style={{ height: `${(d.v / max) * 100}%`, animationDelay: `${i * 80}ms` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold">{d.m}</span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('analytics')} subtitle={isHindi ? 'आसान सारांश' : 'Simple summary'} />
      <GlassCard className="p-5 animate-fade-up stagger-1">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="font-bold text-sm">{isHindi ? 'आय' : 'Income'}</p>
          <span className="ml-auto text-xs font-bold text-primary">+96%</span>
        </div>
        <MiniBar data={analytics.income} color="bg-primary" />
      </GlassCard>
      <GlassCard className="p-5 animate-fade-up stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="h-5 w-5 text-accent" />
          <p className="font-bold text-sm">{isHindi ? 'उपज' : 'Yield'}</p>
        </div>
        <MiniBar data={analytics.yield} color="bg-accent" />
      </GlassCard>
      <GlassCard className="p-5 animate-fade-up stagger-3">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="h-5 w-5 text-primary" />
          <p className="font-bold text-sm">{isHindi ? 'जल उपयोग' : 'Water use'}</p>
          <span className="ml-auto text-xs font-bold text-primary">↓{isHindi ? 'कम' : 'low'}</span>
        </div>
        <MiniBar data={analytics.waterUse} color="bg-chart-4" />
      </GlassCard>
    </div>
  );
}
