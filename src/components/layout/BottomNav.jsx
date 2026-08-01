import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sprout, Store, Sparkles } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

const items = [
  { to: '/', key: 'nav_home', Icon: Home },
  { to: '/crops', key: 'nav_crops', Icon: Sprout },
  { to: '/market', key: 'nav_market', Icon: Store },
  { to: '/ai', key: 'nav_ai', Icon: Sparkles },
];

export default function BottomNav() {
  const { t } = useLang();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-2 pt-1 pointer-events-none"> 
      <div className="mx-auto max-w-md pointer-events-auto">
        <div className="glass-strong rounded-[1.75rem] px-2 py-2 flex items-center justify-between shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.25)]">
          {items.map(({ to, key, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-2xl transition-all tap-target
                ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid place-items-center h-9 w-9 rounded-2xl transition-all
                    ${isActive ? 'bg-primary/15 scale-105' : ''}`}>
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  </span>
                  <span className="text-[10px] font-semibold">{t(key)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}