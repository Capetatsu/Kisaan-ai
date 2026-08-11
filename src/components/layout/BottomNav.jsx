import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sprout, Store, Sparkles, ChevronUp } from 'lucide-react';
import { useLang } from '@/lib/languageContext';

const items = [
  { to: '/', key: 'nav_home', Icon: Home },
  { to: '/crops', key: 'nav_crops', Icon: Sprout },
  { to: '/market', key: 'nav_market', Icon: Store },
  { to: '/ai', key: 'nav_ai', Icon: Sparkles },
];

export default function BottomNav({ aiNavOpen, setAiNavOpen }) {
  const { t } = useLang();
  const location = useLocation();
  const isAiPage = location.pathname === '/ai';
  const showNav = !isAiPage || Boolean(aiNavOpen);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-2 pt-1 pointer-events-none"> 
      <div className={`mx-auto max-w-md flex items-center justify-between gap-3 ${showNav ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`glass-strong rounded-[1.75rem] px-2 py-2 flex items-center justify-between shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out transform ${
          isAiPage ? 'flex-1' : 'w-full'
        } ${
          showNav ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
        }`}>
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
        {isAiPage && showNav && (
          <button
            onClick={() => setAiNavOpen?.((prev) => !prev)}
            className="shrink-0 grid place-items-center h-12 w-12 rounded-full bg-accent text-white border-2 border-accent-edge shadow-[0_4px_0_hsl(var(--accent-edge))] active:translate-y-[2px] active:shadow-none transition-all duration-150 z-50 pointer-events-auto"
            aria-label="Hide navigation"
          >
            <ChevronUp className="h-6 w-6 rotate-180" strokeWidth={2.6} />
          </button>
        )}
      </div>
    </nav>
  );
}