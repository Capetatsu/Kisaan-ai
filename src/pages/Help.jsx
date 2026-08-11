import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import PageHeader from '@/components/layout/PageHeader';
import { Phone, MessageCircle, Video, BookOpen, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

const options = [
  { Icon: Phone, title: 'Krishi Helpline', titleHi: 'कृषि हेल्पलाइन', sub: '1800-180-1551', tone: 'bg-primary/12 text-primary', href: 'tel:18001801551' },
  { Icon: MessageCircle, title: 'WhatsApp Support', titleHi: 'व्हाट्सएप सहायता', sub: 'Chat with agent', tone: 'bg-accent/20 text-accent', href: 'https://wa.me/9118001801551' },
  { Icon: Video, title: 'Video Tutorial', titleHi: 'वीडियो ट्यूटोरियल', sub: 'Learn the app', tone: 'bg-warning/15 text-warning' },
  { Icon: BookOpen, title: 'FAQ', titleHi: 'अक्सर पूछे', sub: 'Common questions', tone: 'bg-chart-4/15 text-chart-4' },
];

export default function Help() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  return (
    <div className="space-y-4">
      <PageHeader title={t('help')} subtitle={isHindi ? 'हम यहाँ हैं' : 'We are here'} />
      <GlassCard strong className="p-5 text-center animate-fade-up" glow>
        <span className="grid place-items-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground mx-auto mb-3 animate-float-soft">
          <Sparkles className="h-7 w-7" />
        </span>
        <p className="font-bold">{isHindi ? 'अटक गए? बोलें' : 'Stuck? Just speak'}</p>
        <p className="text-xs text-muted-foreground mt-1">{isHindi ? 'वॉइस बटन दबाएं और पूछें' : 'Tap the voice button and ask'}</p>
      </GlassCard>
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ Icon, title, titleHi, sub, tone, href }) => (
          <GlassCard key={title} className={`p-4 animate-fade-up active:scale-[0.97] transition-transform ${href ? 'cursor-pointer' : ''}`}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="block" aria-label={title}>
                <span className={`grid place-items-center h-11 w-11 rounded-xl ${tone} mb-3`}><Icon className="h-5 w-5" /></span>
                <p className="font-bold text-sm">{isHindi ? titleHi : title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </a>
            ) : (
              <>
                <span className={`grid place-items-center h-11 w-11 rounded-xl ${tone} mb-3`}><Icon className="h-5 w-5" /></span>
                <p className="font-bold text-sm">{isHindi ? titleHi : title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}