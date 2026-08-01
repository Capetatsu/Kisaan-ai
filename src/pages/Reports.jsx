import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import { FileText, Download } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { reports } from '@/lib/mockData';

export default function Reports() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('reports')} subtitle={isHindi ? 'अपनी रिपोर्ट देखें' : 'View your reports'} />
      {reports.map((r) => (
        <GlassCard key={r.id} className="p-4 flex items-center gap-3 animate-fade-up">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary/12 text-primary shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{isHindi ? r.titleHi : r.title}</p>
            <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
          </div>
          <button className="grid place-items-center h-9 w-9 rounded-lg glass text-primary active:scale-90 transition-transform">
            <Download className="h-4 w-4" />
          </button>
        </GlassCard>
      ))}
    </div>
  );
}