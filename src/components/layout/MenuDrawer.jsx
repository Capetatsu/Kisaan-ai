import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X, Bell, MapPin, BadgeCheck, FileText, BarChart3, Download, Settings as Cog,
  Info, HelpCircle, Moon, Sun, Globe, User, LogOut, Sprout
} from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { useTheme } from '@/lib/themeContext';
import { farmer } from '@/lib/mockData';
import Toggle from '@/components/ui/Toggle';
import OfflineIndicator from '@/components/ui/OfflineIndicator';
import StatusChip from '@/components/ui/StatusChip';

const menuItems = [
  { to: '/farms', key: 'farms', Icon: Sprout },
  { to: '/offline-downloads', key: 'offline_downloads', Icon: Download },
  { to: '/reports', key: 'reports', Icon: FileText },
  { to: '/village-status', key: 'village_status', Icon: MapPin },
  { to: '/verified-advisories', key: 'verified_advisories', Icon: BadgeCheck },
  { to: '/analytics', key: 'analytics', Icon: BarChart3 },
  { to: '/settings', key: 'settings', Icon: Cog },
  { to: '/help', key: 'help', Icon: HelpCircle },
  { to: '/about', key: 'about', Icon: Info },
];

export default function MenuDrawer({ open, onClose, seniorMode, setSeniorMode, onOpenLanguage }) {
  const { t, lang } = useLang();
  const { theme, toggleTheme } = useTheme();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-up" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[86%] max-w-sm glass-strong animate-slide-in-right flex flex-col rounded-l-[2rem]"
        style={{ animationDuration: '0.32s' }}>
        {/* Profile */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <OfflineIndicator />
            <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-full glass tap-target active:scale-90 transition-transform">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <img src={farmer.avatar} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30" />
            <div className="min-w-0">
              <p className="font-bold truncate text-lg">{farmer.name}</p>
              <p className="text-xs text-muted-foreground truncate">{farmer.village} · {farmer.district}</p>
            </div>
            <StatusChip tone="green" className="ml-auto">Pro</StatusChip>
          </div>
        </div>

        {/* Quick toggles */}
        <div className="px-5 pb-4 space-y-3">
          <button onClick={onOpenLanguage} className="w-full flex items-center justify-between py-2 active:opacity-70 transition-opacity">
            <span className="flex items-center gap-2 text-sm font-semibold"><Globe className="h-4 w-4 text-primary" />{t('language')}</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">{lang}<span className="text-xs">›</span></span>
          </button>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold">
              {theme === 'dark' ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
              {theme === 'dark' ? t('dark') : t('light')}
            </span>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} label="theme" />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4 text-primary" />{t('senior_mode')}</span>
            <Toggle checked={seniorMode} onChange={setSeniorMode} label="senior" />
          </div>
        </div>

        <div className="h-px mx-5 bg-border/60" />

        {/* Notifications */}
        <NavLink to="/notifications" onClick={onClose}
          className="flex items-center justify-between px-5 py-3.5 active:bg-muted/50 transition-colors">
          <span className="flex items-center gap-3 font-semibold"><Bell className="h-5 w-5 text-primary" />{t('notifications')}</span>
          <span className="grid place-items-center h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">3</span>
        </NavLink>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-1">
          {menuItems.map(({ to, key, Icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-2xl font-medium transition-colors ${isActive ? 'glass text-primary' : 'hover:bg-muted/60'}`
              }>
              <Icon className="h-5 w-5" />
              {t(key)}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <button className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-muted-foreground font-medium active:bg-muted/60 transition-colors w-full">
            <LogOut className="h-5 w-5" /> {t('sign_out')}
          </button>
        </div>
      </aside>
    </div>
  );
}