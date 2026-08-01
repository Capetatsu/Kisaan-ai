import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Toggle from '@/components/ui/Toggle';
import PageHeader from '@/components/layout/PageHeader';
import { Moon, Sun, Globe, User, Bell, Volume2, Database } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { useTheme } from '@/lib/themeContext';
import { useSenior } from '@/lib/seniorContext';

function Row({ Icon, label, children }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="grid place-items-center h-9 w-9 rounded-xl bg-primary/12 text-primary shrink-0"><Icon className="h-4.5 w-4.5" /></span>
      <span className="font-semibold text-sm flex-1">{label}</span>
      {children}
    </div>
  );
}

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { seniorMode, setSeniorMode } = useSenior();
  const [notif, setNotif] = useState(true);
  const [voice, setVoice] = useState(true);

  return (
    <div className="space-y-4">
      <PageHeader title={t('settings')} />
      <GlassCard className="p-4 divide-y divide-border animate-fade-up">
        <Row Icon={theme === 'dark' ? Moon : Sun} label={theme === 'dark' ? 'Dark mode' : 'Light mode'}>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </Row>
        <Row Icon={Globe} label={t('language')}>
          <div className="flex gap-1 rounded-full glass p-1">
            {[{ c: 'en', l: 'EN' }, { c: 'hi', l: 'हिं' }].map((o) => (
              <button key={o.c} onClick={() => setLang(o.c)}
                className={`px-3 py-1 rounded-full text-xs font-bold ${lang === o.c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>{o.l}</button>
            ))}
          </div>
        </Row>
        <Row Icon={User} label={t('senior_mode')}>
          <Toggle checked={seniorMode} onChange={setSeniorMode} />
        </Row>
        <Row Icon={Bell} label={t('notifications')}>
          <Toggle checked={notif} onChange={setNotif} />
        </Row>
        <Row Icon={Volume2} label={t('voice')}>
          <Toggle checked={voice} onChange={setVoice} />
        </Row>
      </GlassCard>
      <GlassCard className="p-4 flex items-center gap-3 animate-fade-up">
        <Database className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">{t('last_synced')} 2m · {t('cached_advice')}</p>
      </GlassCard>
    </div>
  );
}