import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import KisaanMascot from '@/components/mascot/KisaanMascot';

function ConfidenceBadge({ value }) {
  const label = `${value}%`;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold bg-white/90 text-primary">
      {label}
    </span>
  );
}

export default function RecommendationCard({ rec, isHindi }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const title = isHindi && rec.titleHi ? rec.titleHi : rec.title;
  const reason = isHindi && rec.reasonHi ? rec.reasonHi : rec.reason;

  return (
    <div className="rounded-3xl bg-accent text-white p-5 animate-fade-up border-4 border-accent-edge relative overflow-hidden">
      <div className="absolute -right-6 -bottom-8 opacity-25">
        <KisaanMascot mood="thinking" className="w-32 h-32" />
      </div>
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/20">
              <KisaanMascot mood="happy" className="w-6 h-6" />
            </span>
            <span className="text-xs font-extrabold text-white/80 uppercase tracking-wider">{t('ai_says')}</span>
          </div>
          <ConfidenceBadge value={rec.confidence} />
        </div>
        <h3 className={`text-xl font-extrabold font-heading leading-tight drop-shadow-sm ${done ? 'line-through opacity-70' : ''}`}>{title}</h3>
        {showWhy && (
          <p className="text-sm text-white/85 mt-1 font-semibold">{reason}</p>
        )}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setDone((d) => !d)}
            className="flex-1 h-11 font-extrabold rounded-2xl uppercase tracking-wide text-sm bg-white text-accent border-b-4 border-accent-edge active:translate-y-[3px] active:border-b-0 active:border-transparent transition-all"
          >
            {done ? (
              <span className="inline-flex items-center gap-1"><Check className="h-4 w-4" /> {t('done')}</span>
            ) : (
              t(rec.tone === 'wait' ? 'wait' : 'do_it')
            )}
          </button>
          <button
            onClick={() => setShowWhy((w) => !w)}
            className="h-11 px-4 rounded-2xl bg-white/15 text-sm font-extrabold flex items-center gap-1 active:scale-[0.97] transition-transform"
          >
            {t('view_why')} <ChevronRight className={`h-4 w-4 transition-transform ${showWhy ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}