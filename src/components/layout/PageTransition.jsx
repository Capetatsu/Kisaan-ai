import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { prefersReducedMotion } from '@/lib/animation';

export default function PageTransition({ outletContext }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('enter');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      setDisplayLocation(location);
      return;
    }
    if (prefersReducedMotion()) {
      setDisplayLocation(location);
      return;
    }
    setStage('exit');
  }, [location.pathname]);

  const handleAnimEnd = useCallback(() => {
    if (stage === 'exit') {
      setDisplayLocation(location);
      setStage('enter');
    }
  }, [stage, location]);

  if (prefersReducedMotion()) {
    return (
      <div className="min-h-[1px]">
        <Outlet key={location.pathname} context={outletContext} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-[1px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        stage === 'exit'
          ? 'opacity-0 translate-y-2 scale-[0.99]'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
      onTransitionEnd={handleAnimEnd}
    >
      <Outlet key={displayLocation.pathname} context={outletContext} />
    </div>
  );
}
