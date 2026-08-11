import React, { useEffect, useRef, useState } from 'react';
import { animateProgress, useScrollReveal, prefersReducedMotion } from '@/lib/animation';

export default function AnimatedProgressBar({ value, className, style, color = 'primary', ...props }) {
  const fillRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const revealRef = useScrollReveal({
    once: true,
    onComplete: () => {
      if (!prefersReducedMotion()) {
        animateProgress(fillRef.current, value);
      }
      setShouldAnimate(true);
    },
  });

  const combinedRef = (el) => {
    revealRef(el);
    fillRef.current = null;
  };

  const sizeRef = (el) => {
    fillRef.current = el;
  };

  return (
    <div className={`bar-duo ${className}`} style={style} ref={combinedRef} {...props}>
      <div
        ref={sizeRef}
        className={color === 'primary' ? '' : color === 'sun' ? '!bg-sun' : color === 'tangerine' ? '!bg-tangerine' : color === 'water' ? '!bg-water' : color === 'accent' ? '!bg-accent' : color === 'berry' ? '!bg-berry' : color === 'mint' ? '!bg-mint' : ''}
        style={{ width: shouldAnimate ? `${value}%` : '0%' }}
      />
    </div>
  );
}