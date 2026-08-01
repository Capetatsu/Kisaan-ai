import React, { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useLang, languages } from '@/lib/languageContext';

export default function LanguageSheet({ open, onClose }) {
  const { lang, setLang, t } = useLang();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((l) =>
      l.label.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <div className="absolute top-0 inset-x-0 mx-auto max-w-md glass-strong rounded-b-[2rem] shadow-2xl animate-slide-down overflow-hidden">
        <div className="ambient-glow px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold font-heading">{t('language')}</h2>
            <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-full glass tap-target active:scale-90 transition-transform">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-2xl glass px-3.5 h-11">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_language')}
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
            />
          </div>
        </div>
        <div className="max-h-[50vh] overflow-y-auto no-scrollbar px-3 pb-5">
          {filtered.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); onClose(); }}
              className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-2xl transition-all active:scale-[0.98] mb-1
                ${lang === l.code ? 'glass-strong text-primary' : 'hover:bg-muted/50'}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xl font-semibold font-heading w-7 text-center">{l.native[0]}</span>
                <span className="flex flex-col items-start">
                  <span className="text-sm font-bold">{l.native}</span>
                  <span className="text-[11px] text-muted-foreground">{l.label}</span>
                </span>
              </span>
              {lang === l.code && <Check className="h-5 w-5 text-primary" />}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">—</p>
          )}
        </div>
      </div>
    </div>
  );
}