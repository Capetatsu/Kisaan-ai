import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import StatusChip from '@/components/ui/StatusChip';
import PageHeader from '@/components/layout/PageHeader';
import { Send, Mic, Camera, Sparkles, ArrowRight, Landmark, ChevronUp } from 'lucide-react';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import { useLang } from '@/lib/languageContext';
import { quickSuggestions } from '@/lib/mockData';
import { api } from '@/lib/api';

function AiBubble({ msg, isHindi }) {
  return (
    <GlassCard strong className="p-4 animate-fade-up ml-9">
      <div className="flex items-center gap-2 mb-2">
        <span className="grid place-items-center h-6 w-6 rounded-lg bg-primary/15 text-primary"><Sparkles className="h-3.5 w-3.5" /></span>
        <span className="text-[10px] font-bold text-muted-foreground">AI</span>
        <StatusChip tone="green" className="ml-auto">{msg.confidence}%</StatusChip>
      </div>
      <div className="space-y-2 text-sm">
        <div><span className="text-[10px] font-bold text-muted-foreground uppercase">{isHindi ? 'समस्या' : 'Problem'}</span><p className="font-semibold">{msg.problem}</p></div>
        <div><span className="text-[10px] font-bold text-muted-foreground uppercase">{isHindi ? 'कारण' : 'Reason'}</span><p className="text-muted-foreground">{msg.reason}</p></div>
        <div className="flex items-start gap-2 rounded-2xl bg-primary/10 p-3">
          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div><span className="text-[10px] font-bold text-primary uppercase">{isHindi ? 'कदम' : 'Action'}</span><p className="font-semibold text-primary">{msg.action}</p></div>
        </div>
        {msg.scheme && (
          <div className="flex items-center gap-2 rounded-2xl bg-warning/10 p-3">
            <Landmark className="h-4 w-4 text-warning shrink-0" />
            <p className="text-xs text-warning font-medium">{msg.scheme}</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default function AI() {
  const { t, lang } = useLang();
  const { aiNavOpen, setAiNavOpen } = useOutletContext() || {};
  const isHindi = lang === 'hi';
  const [thread, setThread] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendBounce, setSendBounce] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread]);

  const send = async (text) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setThread((prev) => [...prev, { role: 'user', text }]);
    setInput('');

    try {
      const response = await api.askAI({
        question: text,
        language: lang,
      });
      setThread((prev) => [...prev, { role: 'ai', ...response }]);
    } catch (e) {
      setThread((prev) => [
        ...prev,
        {
          role: 'ai',
          problem: 'Could not get AI advice',
          reason: 'Please try again',
          action: 'Try asking again or check your connection.',
          confidence: 0,
          scheme: null,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const typingBar = (
    <div className="glass-strong rounded-[1.5rem] p-2 flex items-center gap-2 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
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
      <button onClick={() => send(input)} disabled={!input.trim() || sending}
        className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0 border-2 border-primary-edge disabled:opacity-40 active:translate-y-[2px] active:shadow-none transition-transform tap-target"
        style={{ boxShadow: '0 3px 0 #1A5C0A, 0 4px 10px -2px rgba(0,0,0,0.2)' }}>
        <Send className="h-5 w-5" />
      </button>
      <button onClick={() => setAiNavOpen?.((prev) => !prev)}
        className={`grid place-items-center rounded-full bg-accent text-white border-2 border-accent-edge shadow-[0_4px_0_hsl(var(--accent-edge))] active:translate-y-[2px] active:shadow-none transition-all duration-300 ease-in-out pointer-events-auto overflow-hidden ${aiNavOpen ? 'h-0 w-0 opacity-0 border-0 m-0 p-0' : 'h-10 w-10 opacity-100'}`}
        aria-label="Show navigation">
        <ChevronUp className="h-5 w-5 rotate-0" strokeWidth={2.6} />
      </button>
    </div>
  );

  return (
    <div className={`relative animate-page-in space-y-4 transition-all duration-300 ${aiNavOpen ? 'pb-56' : 'pb-36'}`}>
      <PageHeader title={t('nav_ai')} subtitle={isHindi ? 'आपका किसान सहायक' : t('farm_assistant')} />

      {/* Thread */}
      <div className="space-y-3">
        {thread.length === 0 && !sending && (
          <div className="rounded-3xl overflow-hidden animate-fade-up bg-accent border-4 border-accent-edge text-white relative">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">KISAAN AI</p>
                  <p className="text-2xl font-extrabold font-heading mt-1 leading-tight drop-shadow-sm">
                    {isHindi ? 'आपका खेत, आपका साथी' : 'Your farm, your buddy'}
                  </p>
                  <p className="text-xs font-bold mt-1.5 text-white/90 leading-relaxed">
                    {isHindi ? 'कीट, सिंचाई, कटाई, मंडी भाव — कुछ भी पूछें' : 'Pests, irrigation, harvest, mandi prices — ask anything'}
                  </p>
                </div>
                <div className="w-24 h-24 shrink-0 -mr-1">
                  <KisaanMascot mood="happy" className="w-full h-full drop-shadow animate-float-soft" />
                </div>
              </div>
            </div>
          </div>
        )}
        {thread.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} className="flex justify-end animate-fade-up">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium">
                {m.text}
              </div>
            </div>
          ) : <AiBubble key={i} msg={m} isHindi={isHindi} />
        ))}
        {sending && (
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

      {/* Suggestion chips — kept in place */}
      <div className={`fixed bottom-0 inset-x-0 z-30 px-4 pointer-events-none transition-all duration-300 ease-in-out ${aiNavOpen ? 'pb-24' : 'pb-3'}`}>
        <div className="mx-auto max-w-md space-y-2 pointer-events-auto">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {quickSuggestions.map((q) => (
              <button key={q} onClick={() => send(q)}
                className="shrink-0 whitespace-nowrap px-3.5 py-2 rounded-full glass text-xs font-semibold active:scale-95 transition-transform tap-target">
                {q}
              </button>
            ))}
          </div>
          <div aria-hidden className="h-[3.75rem]"></div>
        </div>
      </div>

      {/* Typing bar — portaled to body so it anchors to the true viewport bottom */}
      {createPortal(
        <div className={`fixed bottom-0 inset-x-0 ${aiNavOpen ? 'z-30' : 'z-50'} px-4 pointer-events-none transition-all duration-300 ease-in-out ${aiNavOpen ? 'pb-24' : 'pb-3'}`}>
          <div className="mx-auto max-w-md pointer-events-auto">
            {typingBar}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}