import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

function ConfidenceBadge({ value }) {
  const tone = value >= 85 ? 'green' : value >= 65 ? 'amber' : 'red';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border
      ${tone === 'green' ? 'bg-primary/15 text-primary border-primary/25'
        : tone === 'amber' ? 'bg-warning/15 text-warning border-warning/25'
        : 'bg-destructive/15 text-destructive border-destructive/25'}`}>
      {value}%
    </span>
  );
}

export default function RecommendationCard({ rec, isHindi }) {
  const { t } = useLang();
  const title = isHindi && rec.titleHi ? rec.titleHi : rec.title;
  const reason = isHindi && rec.reasonHi ? rec.reasonHi : rec.reason;

  return (
    <GlassCard strong className="p-5 animate-fade-up" glow>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-8 w-8 rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">{t('ai_says')}</span>
        </div>
        <ConfidenceBadge value={rec.confidence} />
      </div>
      <h3 className="text-xl font-bold font-heading leading-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{reason}</p>
      <div className="flex items-center gap-2 mt-4">
        <button className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:scale-[0.97] transition-transform">
          {t(rec.tone === 'wait' ? 'wait' : 'do_it')}
        </button>
        <button className="h-11 px-4 rounded-xl glass text-sm font-semibold flex items-center gap-1 active:scale-[0.97] transition-transform">
          {t('view_why')} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </GlassCard>
  );
}