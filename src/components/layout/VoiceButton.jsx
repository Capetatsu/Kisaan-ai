import React, { useState } from 'react';
import { Mic, X } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

export default function VoiceButton() {
  const { t } = useLang();
  const [listening, setListening] = useState(false);

  return (
    <>
      {listening && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-6 bg-background/40 backdrop-blur-md"
          onClick={() => setListening(false)}>
          <div className="flex flex-col items-center gap-6 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-semibold text-muted-foreground">{t('listening')}</span>
            <div className="relative grid place-items-center h-32 w-32">
              {listening && (
                <>
                  <span className="absolute inset-0 rounded-full bg-primary/30 animate-orb-pulse" />
                  <span className="absolute inset-3 rounded-full bg-primary/20 animate-orb-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              <button
                onClick={() => setListening(false)}
                className="relative grid place-items-center h-20 w-20 rounded-full bg-primary text-primary-foreground voice-glow animate-pulse-glow active:scale-95 transition-transform"
              >
                <Mic className="h-8 w-8" />
              </button>
            </div>
            <button
              onClick={() => setListening(false)}
              className="grid place-items-center h-11 w-11 rounded-full glass text-muted-foreground active:scale-90 transition-transform"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setListening(true)}
        aria-label={t('tap_to_speak')}
        className="fixed z-40 right-4 bottom-24 grid place-items-center h-14 w-14 rounded-full bg-primary text-primary-foreground voice-glow active:scale-90 transition-transform tap-target"
      >
        <Mic className="h-6 w-6" />
      </button>
    </>
  );
}