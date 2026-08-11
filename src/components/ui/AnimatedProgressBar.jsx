import React, { useEffect, useRef, useState, useCallback } from 'react';
import { animateProgress, useScrollReveal, prefersReducedMotion } from '@/lib/animation';

export default function AnimatedProgressBar({ value, className, style, color = 'primary', ...props }) {
  const fillRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const revealRef = useScrollReveal({
    once: true,
    onComplete: () => {
      if (!prefersReducedMotion() && fillRef.current) {
        animateProgress(fillRef.current, value);
      }
      setShouldAnimate(true);
    },
  });

  const combinedRef = useCallback((el) => {
    revealRef(el);
    if (el) fillRef.current = el.querySelector('div') || el.firstChild;
  }, [revealRef]);

  return (
    <div className={`bar-duo ${className}`} style={style} ref={combinedRef} {...props}>
      <div
        ref={fillRef}
        className={color === 'primary' ? '' : color === 'sun' ? '!bg-sun' : color === 'tangerine' ? '!bg-tangerine' : color === 'water' ? '!bg-water' : color === 'accent' ? '!bg-accent' : color === 'berry' ? '!bg-berry' : color === 'mint' ? '!bg-mint' : ''}
        style={{ width: shouldAnimate ? `${value}%` : '0%' }}
      />
    </div>
  );
}
