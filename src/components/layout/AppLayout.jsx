import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import MenuDrawer from '@/components/layout/MenuDrawer';
import LanguageSheet from '@/components/layout/LanguageSheet';
import { SeniorModeContext } from '@/lib/seniorContext';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const openLanguage = () => setLangOpen(true);

  return (
    <SeniorModeContext.Provider value={{ seniorMode, setSeniorMode }}>
      <div className="min-h-screen flex flex-col relative">
        <div className="pointer-events-none fixed inset-x-0 top-0 h-72 ambient-glow -z-10" />
        <main className={`flex-1 mx-auto w-full max-w-md px-4 pt-3 pb-28 ${seniorMode ? 'text-lg' : ''}`}>
          <Outlet context={{ openMenu, openLanguage }} />
        </main>
        <BottomNav />
        <MenuDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          seniorMode={seniorMode}
          setSeniorMode={setSeniorMode}
          onOpenLanguage={() => { setMenuOpen(false); setLangOpen(true); }}
        />
        <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} />
      </div>
    </SeniorModeContext.Provider>
  );
}