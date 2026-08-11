import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import { AlertTriangle, CloudRain, TrendingUp, Leaf, Landmark, Phone } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { notifications } from '@/lib/mockData';
import { animateStaggerEntrance, prefersReducedMotion } from '@/lib/animation';

const catMeta = {
  urgent: { Icon: AlertTriangle, cls: 'bg-berry/12 text-berry border-berry/25' },
  weather: { Icon: CloudRain, cls: 'bg-water/12 text-water border-water/25' },
  market: { Icon: TrendingUp, cls: 'bg-primary/12 text-primary border-primary/25' },
  crop: { Icon: Leaf, cls: 'bg-tangerine/12 text-tangerine border-tangerine/25' },
  government: { Icon: Landmark, cls: 'bg-accent/12 text-accent border-accent/25' },
  help: { Icon: Phone, cls: 'bg-sun/15 text-sun border-sun/30' },
};

const cats = ['urgent', 'crop', 'market', 'weather', 'government', 'help'];

const catDot = {
  urgent: 'bg-berry',
  crop: 'bg-tangerine',
  market: 'bg-primary',
  weather: 'bg-water',
  government: 'bg-accent',
  help: 'bg-sun',
};

function NotificationCard({ n, isHindi, index }) {
  const { Icon, cls } = catMeta[n.cat];
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      return;
    }
    const delay = index * 60;
    const timer = setTimeout(() => {
      animateStaggerEntrance([el], { delay });
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div ref={ref} key={n.id} className="glass p-4 flex items-start gap-3 rounded-2xl" style={{ opacity: 0 }}>
      <span className={`relative grid place-items-center h-11 w-11 rounded-xl border-2 shrink-0 ${cls}`}>
        <Icon className="h-5 w-5" strokeWidth={2.5} />
        <span className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-card ${catDot[n.cat]}`} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-extrabold text-sm truncate">{isHindi ? n.titleHi : n.title}</p>
          <span className="text-[10px] text-muted-foreground font-bold ml-auto shrink-0">{n.time}</span>
        </div>
        <p className="text-xs text-muted-foreground font-semibold mt-1">{isHindi ? n.body : n.body}</p>
      </div>
    </div>
  );
}

export default function Notifications() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [filter, setFilter] = useState('all');
  const list = filter === 'all' ? notifications : notifications.filter((n) => n.cat === filter);

  return (
    <div className="space-y-4">
      <PageHeader title={t('notifications')} subtitle={isHindi ? 'सभी सूचनाएँ' : 'all alerts'} />
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all tap-target ${filter === 'all' ? 'bg-primary text-white border-2 border-primary-edge shadow-duo' : 'glass border-2'}`}>
          {isHindi ? 'सभी' : 'All'}
        </button>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap capitalize transition-all tap-target ${filter === c ? 'bg-primary text-white border-2 border-primary-edge shadow-duo' : 'glass border-2'}`}>
            {t(c)}
          </button>
        ))}
      </div>
      {list.map((n, index) => (
        <NotificationCard key={n.id} n={n} isHindi={isHindi} index={index} />
      ))}
      {list.length === 0 && (
        <div className="glass p-8 text-center animate-fade-up">
          <KisaanMascot mood="happy" className="w-24 h-24 mx-auto mb-2" />
          <p className="text-sm font-extrabold text-muted-foreground">{isHindi ? 'कोई सूचनाएँ नहीं' : 'No notifications'}</p>
        </div>
      )}
    </div>
  );
}