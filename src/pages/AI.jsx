import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { Send, Mic, Camera, Sparkles, ArrowRight, Landmark } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { aiThread, quickSuggestions } from '@/lib/mockData';

function AiBubble({ msg, isHindi }) {
  return (
    <GlassCard strong className="p-4 animate-fade-up ml-9">
      <div className="flex items-center gap-2 mb-2">
        <span className="grid place-items-center h-6 w-6 rounded-lg bg-primary/15 text-primary"><Sparkles className="h-3.5 w-3.5" /></span>
        <span className="text-[10px] font-bold text-muted-foreground">AI</span>
        <StatusChip tone="green" className="ml-auto">{msg.confidence}%</StatusChip>
      </div>
      <div className="space-y-2 text-sm">
        <div><span className="text-[10px] font-bold text-muted-foreground uppercase">{isHindi ? 'समस्या' : 'Problem'}</span><p className="font-semibold">{isHindi && msg.problemHi ? msg.problemHi : msg.problem}</p></div>
        <div><span className="text-[10px] font-bold text-muted-foreground uppercase">{isHindi ? 'कारण' : 'Reason'}</span><p className="text-muted-foreground">{isHindi && msg.reasonHi ? msg.reasonHi : msg.reason}</p></div>
        <div className="flex items-start gap-2 rounded-2xl bg-primary/10 p-3">
          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div><span className="text-[10px] font-bold text-primary uppercase">{isHindi ? 'कदम' : 'Action'}</span><p className="font-semibold text-primary">{isHindi && msg.actionHi ? msg.actionHi : msg.action}</p></div>
        </div>
        {msg.scheme && (
          <div className="flex items-center gap-2 rounded-2xl bg-warning/10 p-3">
            <Landmark className="h-4 w-4 text-warning shrink-0" />
            <p className="text-xs text-warning font-medium">{isHindi && msg.schemeHi ? msg.schemeHi : msg.scheme}</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default function AI() {
  const { t, lang } = useLang();
  const isHindi = lang === 'hi';
  const [thread, setThread] = useState(aiThread);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread]);

  const send = (text) => {
    if (!text.trim()) return;
    setThread((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'ai', problem: 'Low soil moisture in wheat field', problemHi: 'गेहूं खेत में कम नमी',
        reason: 'No rain for 9 days, high evaporation', reasonHi: '9 दिन से बारिश नहीं, उच्च वाष्पीकरण',
        action: 'Irrigate tonight after 7 PM', actionHi: 'रात 7 बजे के बाद सिंचाई करें',
        confidence: 84, scheme: null,
      },
    ]);
    setInput('');
  };

  return (
    <div className="relative animate-page-in space-y-4 pb-56">
      <PageHeader title={t('nav_ai')} subtitle={isHindi ? 'आपका किसान सहायक' : t('farm_assistant')} />

      {/* Thread */}
      <div className="space-y-3">
        {thread.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="flex justify-end animate-fade-up">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium">
                {m.text}
              </div>
            </div>
          ) : <AiBubble key={i} msg={m} isHindi={isHindi} />
        ))}
        {listening && (
          <div className="flex items-center gap-2 ml-9 animate-fade-up">
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
            </span>
            <span className="text-xs text-muted-foreground">{t('listening')}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Fixed bottom cluster: chips + input — sits above nav, never overlaps */}
      <div className="fixed bottom-0 inset-x-0 z-30 px-4 pb-24">
        <div className="mx-auto max-w-md space-y-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {quickSuggestions.map((q) => (
              <button key={q} onClick={() => send(q)}
                className="shrink-0 whitespace-nowrap px-3.5 py-2 rounded-full glass text-xs font-semibold active:scale-95 transition-transform tap-target">
                {q}
              </button>
            ))}
          </div>
          <div className="glass-strong rounded-[1.5rem] p-2 flex items-center gap-2 shadow-2xl">
            <button onClick={() => setListening((l) => !l)}
              className={`grid place-items-center h-10 w-10 rounded-xl shrink-0 transition-all tap-target ${listening ? 'bg-destructive text-destructive-foreground voice-glow' : 'bg-primary/12 text-primary'}`}>
              <Mic className="h-5 w-5" />
            </button>
            <button className="grid place-items-center h-10 w-10 rounded-xl bg-muted text-muted-foreground shrink-0 tap-target active:scale-90 transition-transform">
              <Camera className="h-5 w-5" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder={t('ask_anything')}
              className="flex-1 bg-transparent outline-none text-sm px-1 min-w-0"
            />
            <button onClick={() => send(input)} disabled={!input.trim()}
              className="grid place-items-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shrink-0 disabled:opacity-40 active:scale-90 transition-transform tap-target">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}