import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Menu, Sun, Moon, Globe } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { useTheme } from '@/lib/themeContext';
import { farmer } from '@/lib/mockData';
import OfflineIndicator from '@/components/ui/OfflineIndicator';

export default function PageHeader({ title, subtitle }) {
  const { openMenu, openLanguage } = useOutletContext();
  const { t } = useLang();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 -mx-4 px-4 pt-3 pb-2.5 mb-1 bg-background/80 backdrop-blur-2xl border-b border-border/30">
      <div className="flex items-center justify-between gap-2">
        {/* Profile */}
        <button onClick={openMenu} className="shrink-0 active:scale-90 transition-transform" aria-label={t('profile')}>
          <img src={farmer.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30" />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0 text-center">
          {title && <h1 className="text-base font-bold font-heading truncate leading-tight">{title}</h1>}
          {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
        </div>

        {/* Actions: Language, Theme, Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={openLanguage}
            className="grid place-items-center h-10 w-10 rounded-full glass tap-target active:scale-90 transition-transform" aria-label={t('language')}>
            <Globe className="h-4.5 w-4.5 text-primary" />
          </button>
          <button onClick={toggleTheme}
            className="grid place-items-center h-10 w-10 rounded-full glass tap-target active:scale-90 transition-transform" aria-label="theme">
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-warning" /> : <Moon className="h-4.5 w-4.5 text-primary" />}
          </button>
          <button onClick={openMenu}
            className="grid place-items-center h-10 w-10 rounded-full glass tap-target active:scale-90 transition-transform" aria-label={t('nav_menu')}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex justify-center">
        <OfflineIndicator />
      </div>
    </header>
  );
}