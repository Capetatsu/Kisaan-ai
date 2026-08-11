import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Menu, Sun, Moon, Globe, User } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { useTheme } from '@/lib/themeContext';
import OfflineIndicator from '@/components/ui/OfflineIndicator';

export default function PageHeader({ title, subtitle }) {
  const { openMenu, openLanguage } = useOutletContext();
  const { t } = useLang();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 -mx-4 px-4 pt-4 pb-3 mb-3 bg-background/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        {/* Profile avatar — friendly ring */}
        <button
          onClick={openMenu}
          className="shrink-0 active:scale-90 transition-transform relative tap-target"
          aria-label={t('profile')}
        >
          <span className="absolute -top-0.5 -right-0.5 z-10 grid place-items-center h-4 w-4 rounded-full bg-primary text-white text-[9px] font-extrabold animate-bell-wiggle">3</span>
          <span className="h-12 w-12 rounded-full border-[3px] border-card shadow-duo bg-primary/15 grid place-items-center text-primary">
            <User className="h-6 w-6" strokeWidth={2} />
          </span>
        </button>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          {title && <h1 className="text-[22px] leading-tight font-extrabold font-heading truncate tracking-tight">{title}</h1>}
          {subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5 font-semibold">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openLanguage}
            className="grid place-items-center h-11 w-11 rounded-xl bg-card border-2 border-border active:translate-y-[2px] active:shadow-none transition-all tap-target"
            style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.12), 0 1px 2px -1px rgba(0,0,0,0.08)' }}
            aria-label={t('language')}
          >
            <Globe className="h-5 w-5 text-water" strokeWidth={2.4} />
          </button>
          <button
            onClick={toggleTheme}
            className="grid place-items-center h-11 w-11 rounded-xl bg-card border-2 border-border active:translate-y-[2px] active:shadow-none transition-all tap-target"
            style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.12), 0 1px 2px -1px rgba(0,0,0,0.08)' }}
            aria-label="theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-sun" strokeWidth={2.4} /> : <Moon className="h-5 w-5 text-accent" strokeWidth={2.4} />}
          </button>
          <button
            onClick={openMenu}
            className="grid place-items-center h-11 w-11 rounded-xl bg-primary text-white border-2 border-primary-edge active:translate-y-[2px] active:shadow-none transition-all tap-target"
            style={{ boxShadow: '0 3px 0 #1A5C0A, 0 4px 12px -2px rgba(0,0,0,0.2)' }}
            aria-label={t('nav_menu')}
          >
            <Menu className="h-5 w-5" strokeWidth={2.6} />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <OfflineIndicator />
      </div>
    </header>
  );
}