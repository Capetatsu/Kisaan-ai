import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { animateSlideFadeIn, animateSlideFadeOut, prefersReducedMotion } from '@/lib/animation';

export default function PageTransition({ outletContext }) {
  const location = useLocation();
  const outletRef = useRef(null);
  const [key, setKey] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setKey(k => k + 1);
      return;
    }
    const outlet = outletRef.current;
    if (!outlet) {
      setKey(k => k + 1);
      return;
    }
    animateSlideFadeOut(outlet, 'up').then(() => {
      if (!isMountedRef.current) return;
      setKey(k => k + 1);
      requestAnimationFrame(() => {
        if (!isMountedRef.current) return;
        animateSlideFadeIn(outlet, 'up');
      });
    });
  }, [location.pathname]);

  return (
    <div ref={outletRef} style={{ position: 'relative', minHeight: '1px' }}>
      <Outlet key={key} context={outletContext} />
    </div>
  );
}