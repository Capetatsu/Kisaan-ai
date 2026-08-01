import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { BadgeCheck } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { verifiedAdvisories } from '@/lib/mockData';

export default function VerifiedAdvisories() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('verified_advisories')} subtitle={isHindi ? 'सत्यापित स्रोत' : 'From verified sources'} />
      {verifiedAdvisories.map((a) => (
        <GlassCard key={a.id} className="p-4 animate-fade-up">
          <div className="flex items-center gap-2 mb-2">
            <StatusChip tone="green" icon={BadgeCheck}>{a.src}</StatusChip>
            <span className="text-[10px] text-muted-foreground ml-auto">{a.time}</span>
          </div>
          <p className="font-bold text-sm leading-snug">{isHindi ? a.titleHi : a.title}</p>
          <button className="mt-3 text-xs font-bold text-primary">{isHindi ? 'विवरण' : 'Read more'}</button>
        </GlassCard>
      ))}
      <GlassCard className="p-4 text-center animate-fade-up">
        <p className="text-xs text-muted-foreground">{isHindi ? 'केवल सत्यापित सलाह — कोई सोशल फ़ीड नहीं।' : 'Verified advisories only — no social feed.'}</p>
      </GlassCard>
    </div>
  );
}