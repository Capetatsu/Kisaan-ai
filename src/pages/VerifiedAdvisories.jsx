import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { BadgeCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { verifiedAdvisories } from '@/lib/mockData';

export default function VerifiedAdvisories() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [expanded, setExpanded] = useState({});

  return (
    <div className="space-y-4">
      <PageHeader title={t('verified_advisories')} subtitle={isHindi ? 'सत्यापित स्रोत' : 'From verified sources'} />
      {verifiedAdvisories.map((a) => {
        const open = Boolean(expanded[a.id]);
        return (
          <GlassCard key={a.id} className="p-4 animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
              <StatusChip tone="green" icon={BadgeCheck}>{a.src}</StatusChip>
              <span className="text-[10px] text-muted-foreground ml-auto">{a.time}</span>
            </div>
            <p className="font-bold text-sm leading-snug">{isHindi ? a.titleHi : a.title}</p>
            {open && (
              <p className="mt-2 text-xs text-muted-foreground font-semibold leading-relaxed">{isHindi ? a.bodyHi : a.body}</p>
            )}
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [a.id]: !prev[a.id] }))}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary active:opacity-70 transition-opacity"
            >
              {isHindi ? 'विवरण' : 'Read more'}
              {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </GlassCard>
        );
      })}
      <GlassCard className="p-4 text-center animate-fade-up">
        <p className="text-xs text-muted-foreground">{isHindi ? 'केवल सत्यापित सलाह — कोई सोशल फ़ीड नहीं।' : 'Verified advisories only — no social feed.'}</p>
      </GlassCard>
    </div>
  );
}