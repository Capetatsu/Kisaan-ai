import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import { AlertTriangle, CloudRain, TrendingUp, Leaf, Landmark, Phone } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { notifications } from '@/lib/mockData';

const catMeta = {
  urgent: { Icon: AlertTriangle, tone: 'bg-destructive/15 text-destructive' },
  weather: { Icon: CloudRain, tone: 'bg-primary/12 text-primary' },
  market: { Icon: TrendingUp, tone: 'bg-accent/20 text-accent-foreground' },
  crop: { Icon: Leaf, tone: 'bg-warning/15 text-warning' },
  government: { Icon: Landmark, tone: 'bg-chart-4/15 text-chart-4' },
  help: { Icon: Phone, tone: 'bg-primary/12 text-primary' },
};

const cats = ['urgent', 'crop', 'market', 'weather', 'government', 'help'];

export default function Notifications() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? notifications : notifications.filter((n) => n.cat === filter);

  return (
    <div className="space-y-4">
      <PageHeader title={t('notifications')} />
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <button onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'glass'}`}>
          {isHindi ? 'सभी' : 'All'}
        </button>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${filter === c ? 'bg-primary text-primary-foreground' : 'glass'}`}>
            {t(c)}
          </button>
        ))}
      </div>
      {list.map((n) => {
        const { Icon, tone } = catMeta[n.cat];
        return (
          <GlassCard key={n.id} className="p-4 flex items-start gap-3 animate-fade-up">
            <span className={`grid place-items-center h-10 w-10 rounded-xl shrink-0 ${tone}`}><Icon className="h-5 w-5" /></span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm truncate">{isHindi ? n.titleHi : n.title}</p>
                <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}