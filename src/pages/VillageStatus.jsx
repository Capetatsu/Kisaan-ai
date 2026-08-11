import React, { useEffect, useRef, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { Users, Home, Droplets, Bell, Sprout } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { villageStats } from '@/lib/mockData';
import { animateCount, prefersReducedMotion } from '@/lib/animation';

function CountUp({ to }) {
  const [display, setDisplay] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(to);
      return;
    }
    if (started.current) return;
    started.current = true;
    setDisplay(0);
    const anim = animateCount(null, 0, to, {
      onUpdate: (v) => setDisplay(v),
    });
    return () => { anim?.pause?.(); };
  }, [to]);

  return <>{display}</>;
}

const stats = [
  { Icon: Users, label: 'Farmers', labelHi: 'किसान', value: villageStats.farmers },
  { Icon: Home, label: 'Households', labelHi: 'परिवार', value: villageStats.households },
  { Icon: Sprout, label: 'Crop cover', labelHi: 'फसल कवर', value: villageStats.cropCover },
  { Icon: Bell, label: 'Alerts', labelHi: 'अलर्ट', value: villageStats.activeAlerts },
];

export default function VillageStatus() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('village_status')} subtitle="Dharampuri · Indore" />
      <GlassCard strong className="p-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{isHindi ? 'जल स्तर' : 'Water level'}</p>
            <p className="text-2xl font-bold font-heading"><CountUp to={villageStats.waterLevel} /></p>
          </div>
          <span className="grid place-items-center h-14 w-14 rounded-2xl bg-primary/12 text-primary animate-float-soft">
            <Droplets className="h-7 w-7" />
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted mt-4 overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: '72%' }} />
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ Icon, label, labelHi, value }) => (
          <GlassCard key={label} className="p-4 animate-fade-up">
            <Icon className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold font-heading"><CountUp to={value} /></p>
            <p className="text-xs text-muted-foreground">{isHindi ? labelHi : label}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <StatusChip tone="amber" pulse>{villageStats.activeAlerts} {isHindi ? 'सक्रिय अलर्ट' : 'active alerts'}</StatusChip>
        <p className="text-xs text-muted-foreground">{isHindi ? 'आसपास कीट प्रकोप रिपोर्ट' : 'Pest outbreak reported nearby'}</p>
      </GlassCard>
    </div>
  );
}