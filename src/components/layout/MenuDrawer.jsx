import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  X, Bell, MapPin, BadgeCheck, FileText, BarChart3, Download, Settings as Cog,
  Info, HelpCircle, Globe, User, LogOut, Sprout
} from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { useTheme } from '@/lib/themeContext';
import { useAuth } from '@/lib/AuthContext';
import { farmer } from '@/lib/mockData';
import Toggle from '@/components/ui/Toggle';
import OfflineIndicator from '@/components/ui/OfflineIndicator';
import StatusChip from '@/components/ui/StatusChip';
import KisaanMascot from '@/components/mascot/KisaanMascot';
import { animateSlideFadeIn, animateSlideFadeOut, prefersReducedMotion } from '@/lib/animation';

const menuItems = [
  { to: '/farms', key: 'farms', Icon: Sprout, color: 'text-primary' },
  { to: '/offline-downloads', key: 'offline_downloads', Icon: Download, color: 'text-water' },
  { to: '/reports', key: 'reports', Icon: FileText, color: 'text-sun' },
  { to: '/village-status', key: 'village_status', Icon: MapPin, color: 'text-tangerine' },
  { to: '/verified-advisories', key: 'verified_advisories', Icon: BadgeCheck, color: 'text-mint' },
  { to: '/analytics', key: 'analytics', Icon: BarChart3, color: 'text-accent' },
  { to: '/settings', key: 'settings', Icon: Cog, color: 'text-muted-foreground' },
  { to: '/help', key: 'help', Icon: HelpCircle, color: 'text-water' },
  { to: '/about', key: 'about', Icon: Info, color: 'text-muted-foreground' },
];

export default function MenuDrawer({ open, onClose, seniorMode, setSeniorMode, onOpenLanguage }) {
  const { t, lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { logout, navigateToLogin } = useAuth();
  const overlayRef = useRef(null);
  const asideRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (prefersReducedMotion()) return;
    animateSlideFadeIn(overlayRef.current, 'up');
    animateSlideFadeIn(asideRef.current, 'left');
  }, [open]);

  const handleClose = async () => {
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    setIsExiting(true);
    await Promise.all([
      animateSlideFadeOut(overlayRef.current, 'up'),
      animateSlideFadeOut(asideRef.current, 'right'),
    ]);
    setIsExiting(false);
    onClose();
  };

  if (!open && !isExiting) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        style={{ opacity: open && !isExiting ? 1 : 0 }}
      />
      <aside
        ref={asideRef}
        className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-card flex flex-col rounded-l-[2rem] border-l-2 border-b-2 border-border shadow-lift"
        style={{ transform: open && !isExiting ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Profile */}
        <div className="px-5 pt-4 pb-4 bg-primary text-primary-foreground rounded-l-[2rem] -mr-[2px]">
          <div className="flex items-center justify-between mb-3">
            <OfflineIndicator />
            <button onClick={handleClose} className="grid place-items-center h-9 w-9 rounded-xl bg-white/15 text-white tap-target active:scale-90 transition-transform">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <KisaanMascot mood="happy" className="w-16 h-16 shrink-0 drop-shadow" />
            <div className="min-w-0">
              <p className="font-extrabold truncate text-lg leading-tight">{farmer.name}</p>
              <p className="text-xs text-primary-foreground/80 truncate font-semibold">{farmer.village} · {farmer.district}</p>
              <StatusChip tone="white" className="mt-1.5">Pro</StatusChip>
            </div>
          </div>
        </div>

        {/* Quick toggles */}
        <div className="px-5 py-4 space-y-2">
          <button onClick={onOpenLanguage} className="w-full opt-duo">
            <Globe className="h-5 w-5 text-water" />
            <span className="flex-1">{t('language')}</span>
            <span className="text-xs font-extrabold uppercase text-muted-foreground flex items-center gap-1">
              {lang} <span className="text-water text-lg leading-none">›</span>
            </span>
          </button>
          <div className="opt-duo">
            <Globe className="h-5 w-5 text-accent" />
            <span className="flex-1">{theme === 'dark' ? t('dark') : t('light')}</span>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} label="theme" />
          </div>
          <div className="opt-duo">
            <User className="h-5 w-5 text-tangerine" />
            <span className="flex-1">{t('senior_mode')}</span>
            <Toggle checked={seniorMode} onChange={setSeniorMode} label="senior" />
          </div>
        </div>

        <div className="h-[2px] mx-5 bg-border/60" />

        <div className="flex-1 flex flex-col bg-primary/5 rounded-b-l-[2rem] overflow-hidden">
          {/* Notifications */}
          <NavLink to="/notifications" onClick={handleClose}
            className="flex items-center justify-between mx-3 mt-3 px-4 py-3.5 rounded-2xl bg-berry/10 border-2 border-berry/25 active:scale-[0.98] transition-transform">
            <span className="flex items-center gap-3 font-extrabold text-berry"><Bell className="h-5 w-5" strokeWidth={2.5} />{t('notifications')}</span>
            <span className="grid place-items-center h-6 w-6 rounded-full bg-berry text-white text-[11px] font-extrabold">3</span>
          </NavLink>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-1.5">
            {menuItems.map(({ to, key, Icon, color }) => (
              <NavLink key={to} to={to} onClick={handleClose}
                className={({ isActive }) =>
                  `opt-duo ${isActive ? 'opt-duo-active' : ''}`
                }>
                <Icon className={`h-5 w-5 ${color}`} strokeWidth={2.3} />
                <span className="flex-1">{t(key)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4">
            <button
              onClick={() => {
                logout();
                navigateToLogin();
              }}
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl w-full font-extrabold text-berry border-2 border-berry/30 bg-berry/10 active:scale-[0.98] transition-transform">
              <LogOut className="h-5 w-5" /> {t('sign_out')}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}