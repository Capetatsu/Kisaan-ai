import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { animateEntrance, animatePress, animateRelease, prefersReducedMotion } from '@/lib/animation';

export default function GlassCard({ children, className, onClick, strong, glow, style, index = 0 }) {
  const cardRef = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || prefersReducedMotion()) {
      setHasAnimated(true);
      return;
    }
    const delay = index * 60;
    const timer = setTimeout(() => {
      animateEntrance(cardRef.current, { delay }).then(() => {
        setHasAnimated(true);
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseDown = () => {
    if (!prefersReducedMotion() && cardRef.current) {
      animatePress(cardRef.current);
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (!prefersReducedMotion() && cardRef.current) {
      animateRelease(cardRef.current);
      setIsPressed(false);
    }
  };

  const handleMouseLeave = () => {
    if (isPressed && cardRef.current && !prefersReducedMotion()) {
      animateRelease(cardRef.current);
      setIsPressed(false);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseDown={onClick ? handleMouseDown : undefined}
      onMouseUp={onClick ? handleMouseUp : undefined}
      onMouseLeave={onClick ? handleMouseLeave : undefined}
      style={style}
      className={cn(
        strong ? 'glass-strong' : 'glass',
        'rounded-2xl',
        glow && 'glow-ring',
        onClick && 'cursor-pointer',
        isPressed && 'scale-[0.985]',
        className
      )}
    >
      {children}
    </div>
  );
}