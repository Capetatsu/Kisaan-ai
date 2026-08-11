import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Sprout, Store, Sparkles, ChevronUp } from 'lucide-react';
import { useLang } from '@/lib/languageContext';
import { useTheme } from '@/lib/themeContext';

const items = [
  { to: '/', key: 'nav_home', Icon: Home, activeBg: 'bg-tangerine/15', activeText: 'text-[#C65D00]', activeTextDark: 'text-[#FFB366]' },
  { to: '/crops', key: 'nav_crops', Icon: Sprout, activeBg: 'bg-primary/15', activeText: 'text-[#1A6B0A]', activeTextDark: 'text-[#7ED23A]' },
  { to: '/market', key: 'nav_market', Icon: Store, activeBg: 'bg-water/15', activeText: 'text-[#0A5C7A]', activeTextDark: 'text-[#5BC0EB]' },
  { to: '/ai', key: 'nav_ai', Icon: Sparkles, activeBg: 'bg-accent/15', activeText: 'text-[#5A1FA0]', activeTextDark: 'text-[#B680FF]' },
];

export default function BottomNav({ aiNavOpen, setAiNavOpen }) {
  const { t } = useLang();
  const { theme } = useTheme();
  const location = useLocation();
  const isAiPage = location.pathname === '/ai';
  const showNav = !isAiPage || Boolean(aiNavOpen);
  const isDark = theme === 'dark';
  const [bouncing, setBouncing] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-4 pb-2 pt-1 pointer-events-none">
      <div className={`mx-auto max-w-md flex items-center justify-between gap-3 ${showNav ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`rounded-[1.75rem] px-2 py-3 flex items-center justify-between transition-all duration-[500ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform ${
          isDark
            ? 'bg-[#F0F0F0] border-2 border-[#D0D0D0] shadow-[0_6px_0_#B0B0B0,0_8px_24px_-4px_rgba(0,0,0,0.2)]'
            : 'bg-[#16171D] border-2 border-[#212121] shadow-[0_6px_0_#30323A,0_8px_24px_-4px_rgba(0,0,0,0.5)]'
        } ${
          isAiPage ? 'flex-1' : 'w-full'
        } ${
          showNav ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-[0.97] pointer-events-none'
        }`}>
          {items.map(({ to, key, Icon, activeBg, activeText, activeTextDark }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-center flex-1 py-2.5 rounded-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] tap-target
                ${isActive ? `gap-2 px-3 h-14 ${isDark ? 'bg-[#1F2128] shadow-[inset_0_0_0_2px_#2A2A2A,0_4px_0_#30323A,0_5px_12px_-2px_rgba(0,0,0,0.3)]' : 'bg-white shadow-[inset_0_0_0_2px_#D0D0D0,0_4px_0_#AAAAAA,0_5px_12px_-2px_rgba(0,0,0,0.15)]'} ${isActive && isDark ? activeTextDark : activeText} ${bouncing && isActive ? 'animate-nav-bounce' : ''}` : isDark ? 'text-[#6B6B6B]' : 'text-white/60'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-6 w-6 shrink-0`} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && <span className="text-sm font-extrabold">{t(key)}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
        {isAiPage && showNav && (
          <button
            onClick={() => setAiNavOpen?.((prev) => !prev)}
            className="shrink-0 grid place-items-center h-12 w-12 rounded-full bg-accent text-white border-2 border-accent-edge shadow-[0_4px_0_hsl(var(--accent-edge))] active:translate-y-[2px] active:shadow-none transition-all duration-[500ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] z-50 pointer-events-auto"
            aria-label="Hide navigation"
          >
            <ChevronUp className="h-6 w-6 rotate-180" strokeWidth={2.6} />
          </button>
        )}
      </div>
    </nav>
  );
}
