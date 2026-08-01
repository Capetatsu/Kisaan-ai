import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import { Leaf, Sparkles, Heart } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

export default function About() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('about')} />
      <GlassCard strong className="p-6 text-center animate-fade-up" glow>
        <span className="grid place-items-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground mx-auto mb-3 animate-float-soft">
          <Leaf className="h-8 w-8" />
        </span>
        <h2 className="text-xl font-bold font-heading">KhetiAI</h2>
        <p className="text-xs text-muted-foreground mt-1">{isHindi ? 'किसान का एआई साथी' : 'Farmer’s AI companion'}</p>
        <p className="text-[10px] text-muted-foreground mt-2">v1.0 · Smart India Hackathon</p>
      </GlassCard>
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground">{isHindi ? 'फसल, मंडी और मौसम की आसान सलाह — बोलकर या फोटो से।' : 'Simple advice for crops, market & weather — by voice or photo.'}</p>
      </GlassCard>
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <Heart className="h-5 w-5 text-destructive shrink-0" />
        <p className="text-sm text-muted-foreground">{isHindi ? 'भारत के किसानों के लिए बनाया गया।' : 'Built for India’s farmers.'}</p>
      </GlassCard>
    </div>
  );
}