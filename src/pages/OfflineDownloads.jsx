import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { Download, CheckCircle2, Cloud } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { offlineFiles } from '@/lib/mockData';

export default function OfflineDownloads() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('offline_downloads')} subtitle={isHindi ? 'बिना इंटरनेट उपयोग' : 'Use without internet'} />
      <GlassCard strong className="p-5 flex items-center gap-4 animate-fade-up">
        <span className="grid place-items-center h-12 w-12 rounded-2xl bg-primary text-primary-foreground shrink-0">
          <Cloud className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="font-bold">{t('cached_advice')}</p>
          <p className="text-xs text-muted-foreground">{t('last_synced')} 2m</p>
        </div>
        <StatusChip tone="green">{t('online')}</StatusChip>
      </GlassCard>
      {offlineFiles.map((f) => (
        <GlassCard key={f.id} className="p-4 flex items-center gap-3 animate-fade-up">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-primary/12 text-primary shrink-0">
            {f.saved ? <CheckCircle2 className="h-5 w-5" /> : <Download className="h-5 w-5" />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{f.name}</p>
            <p className="text-xs text-muted-foreground">{f.size}</p>
          </div>
          {f.saved
            ? <StatusChip tone="green">{t('enabled')}</StatusChip>
            : <button className="text-xs font-bold text-primary px-3 py-2 rounded-lg bg-primary/10 active:scale-95 transition-transform">{isHindi ? 'सहेजें' : 'Save'}</button>}
        </GlassCard>
      ))}
    </div>
  );
}