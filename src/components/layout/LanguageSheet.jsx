import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useLang, languages } from '@/lib/languageContext';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import { animateSlideFadeIn, animateSlideFadeOut, prefersReducedMotion } from '@/lib/animation';

export default function LanguageSheet({ open, onClose }) {
  const { lang, setLang, t } = useLang();
  const [query, setQuery] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((l) =>
      l.label.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    if (prefersReducedMotion()) return;
    animateSlideFadeIn(overlayRef.current, 'up');
    animateSlideFadeIn(sheetRef.current, 'down');
  }, [open]);

  const handleClose = async () => {
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    setIsExiting(true);
    await Promise.all([
      animateSlideFadeOut(overlayRef.current, 'up'),
      animateSlideFadeOut(sheetRef.current, 'up'),
    ]);
    setIsExiting(false);
    onClose();
  };

  if (!open && !isExiting) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        style={{ opacity: open && !isExiting ? 1 : 0 }}
      />
      <div
        ref={sheetRef}
        className="absolute top-0 inset-x-0 mx-auto max-w-md bg-card rounded-b-[2rem] border-2 border-border border-t-0 shadow-lift overflow-hidden"
        style={{ transform: open && !isExiting ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <div className="ambient-glow px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-extrabold font-heading tracking-tight">{t('language')}</h2>
            <button onClick={handleClose} className="grid place-items-center h-9 w-9 rounded-xl bg-card border-2 border-border tap-target active:scale-90 transition-transform">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-2xl glass px-3.5 h-12">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_language')}
              className="flex-1 bg-transparent outline-none text-sm font-semibold min-w-0"
            />
          </div>
        </div>
        <div className="px-4 pb-4">
          <KisaanMascot mood="happy" className="w-12 h-12 mx-auto my-1 animate-float-soft" />
        </div>
        <div className="max-h-[46vh] overflow-y-auto no-scrollbar px-3 pb-5">
          {filtered.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); handleClose(); }}
              className={`opt-duo mb-1.5 ${lang === l.code ? 'opt-duo-active' : ''}`}
            >
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-muted text-xl font-extrabold shrink-0">{l.native[0]}</span>
              <span className="flex flex-col items-start flex-1">
                <span className="text-base font-extrabold leading-tight">{l.native}</span>
                <span className="text-[11px] text-muted-foreground font-bold">{l.label}</span>
              </span>
              {lang === l.code && <Check className="h-5 w-5 text-water shrink-0" strokeWidth={3} />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8 font-bold">—</p>
          )}
        </div>
      </div>
    </div>
  );
}