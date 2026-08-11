import React, { useState } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import MenuDrawer from '@/components/layout/MenuDrawer';
import LanguageSheet from '@/components/layout/LanguageSheet';
import PageTransition from '@/components/layout/PageTransition';
import { SeniorModeContext } from '@/lib/seniorContext';

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);
  const [aiNavOpen, setAiNavOpen] = useState(true);

  const openMenu = () => setMenuOpen(true);
  const openLanguage = () => setLangOpen(true);

  return (
    <SeniorModeContext.Provider value={{ seniorMode, setSeniorMode }}>
      <div className="min-h-screen flex flex-col relative bg-background">
        <main className={`flex-1 mx-auto w-full max-w-md sm:max-w-2xl lg:max-w-3xl px-4 pt-3 pb-28 ${seniorMode ? 'text-lg' : ''}`}>
          <PageTransition outletContext={{ openMenu, openLanguage, aiNavOpen, setAiNavOpen }} />
        </main>
        <BottomNav aiNavOpen={aiNavOpen} setAiNavOpen={setAiNavOpen} />
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