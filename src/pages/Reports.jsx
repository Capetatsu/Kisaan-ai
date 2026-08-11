import React, { useState, useRef } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import { FileText, Download } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { reports } from '@/lib/mockData';
import { animateSuccessBurst, prefersReducedMotion } from '@/lib/animation';

function CheckmarkSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" className="animate-checkmark-draw" />
    </svg>
  );
}

export default function Reports() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [downloaded, setDownloaded] = useState({});
  const checkRefs = useRef({});

  const handleDownload = (r) => {
    setDownloaded((prev) => ({ ...prev, [r.id]: true }));
    if (!prefersReducedMotion() && checkRefs.current[r.id]) {
      animateSuccessBurst(checkRefs.current[r.id]);
    }
    setTimeout(() => {
      setDownloaded((prev) => ({ ...prev, [r.id]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-4">
      <PageHeader title={t('reports')} subtitle={isHindi ? 'अपनी रिपोर्ट देखें' : 'View your reports'} />
      {reports.map((r, i) => (
        <GlassCard key={r.id} className={`p-4 flex items-center gap-3 animate-fade-up stagger-${i + 1}`}>
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/12 text-primary shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{isHindi ? r.titleHi : r.title}</p>
            <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
          </div>
          {downloaded[r.id] ? (
            <span
              ref={(el) => { checkRefs.current[r.id] = el; }}
              className="grid place-items-center h-9 w-9 rounded-lg bg-primary/12 text-primary shrink-0"
            >
              <CheckmarkSVG className="h-5 w-5" />
            </span>
          ) : (
            <button
              onClick={() => handleDownload(r)}
              className="grid place-items-center h-9 w-9 rounded-lg glass text-primary active:scale-90 transition-transform"
              aria-label={isHindi ? 'डाउनलोड' : 'Download'}
            >
              <Download className="h-4 w-4" />
            </button>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
