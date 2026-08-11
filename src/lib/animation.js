import { animate as anime, stagger, eases, cubicBezier } from 'animejs';
import { useEffect, useRef, useCallback, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const spring = {
  duration: 350,
  easing: cubicBezier(0.34, 1.56, 0.64, 1),
};

export const quick = {
  duration: 180,
  easing: cubicBezier(0.22, 1, 0.36, 1),
};

export const gentle = {
  duration: 500,
  easing: cubicBezier(0.25, 0.46, 0.45, 0.94),
};

export function animateEntrance(targets, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(targets, {
    opacity: [0, 1],
    translateY: [12, 0],
    duration: 350,
    easing: cubicBezier(0.22, 1, 0.36, 1),
    ...options,
  });
}

export function animateStaggerEntrance(targets, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(targets, {
    opacity: [0, 1],
    translateY: [16, 0],
    delay: stagger(60, { start: 80 }),
    duration: 400,
    easing: cubicBezier(0.22, 1, 0.36, 1),
    ...options,
  });
}

export function animateScalePop(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    scale: [0.92, 1.06, 1],
    duration: 320,
    easing: cubicBezier(0.34, 1.56, 0.64, 1),
    ...options,
  });
}

export function animatePress(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    scale: 0.96,
    duration: 80,
    easing: cubicBezier(0.22, 1, 0.36, 1),
    ...options,
  });
}

export function animateRelease(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    scale: 1,
    duration: 180,
    easing: cubicBezier(0.34, 1.56, 0.64, 1),
    ...options,
  });
}

export function animateProgress(target, value, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    width: `${value}%`,
    duration: 600,
    easing: cubicBezier(0.22, 1, 0.36, 1),
    ...options,
  });
}

export function animateCount(target, from, to, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  const obj = { value: from };
  const onUpdate = options.onUpdate;
  return anime(obj, {
    value: to,
    duration: 800,
    easing: cubicBezier(0.22, 1, 0.36, 1),
    round: 1,
    onRender: () => {
      if (onUpdate) onUpdate(Math.round(obj.value));
    },
    ...options,
  });
}

export function animateSlideFadeIn(target, direction = 'up', options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  const translateMap = {
    up: [16, 0],
    down: [-16, 0],
    left: [24, 0],
    right: [-24, 0],
  };
  return anime(target, {
    opacity: [0, 1],
    [direction === 'left' || direction === 'right' ? 'translateX' : 'translateY']: translateMap[direction],
    duration: 300,
    easing: cubicBezier(0.22, 1, 0.36, 1),
    ...options,
  });
}

export function animateSlideFadeOut(target, direction = 'up', options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  const translateMap = {
    up: [0, -16],
    down: [0, 16],
    left: [0, -24],
    right: [0, 24],
  };
  return anime(target, {
    opacity: [1, 0],
    [direction === 'left' || direction === 'right' ? 'translateX' : 'translateY']: translateMap[direction],
    duration: 220,
    easing: cubicBezier(0.55, 0.06, 0.68, 0.19),
    ...options,
  });
}

export function animateFloat(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    translateY: [0, -6, 0],
    duration: 3500,
    easing: eases.inOutSine,
    loop: true,
    ...options,
  });
}

export function animateBreathe(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    scale: [1, 1.02, 1],
    duration: 4000,
    easing: eases.inOutSine,
    loop: true,
    ...options,
  });
}

export function animateSuccessBurst(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    scale: [1, 1.15, 1],
    rotate: [-3, 3, -2, 2, 0],
    duration: 600,
    easing: cubicBezier(0.34, 1.56, 0.64, 1),
    ...options,
  });
}

export function animateShake(target, options = {}) {
  if (prefersReducedMotion()) return Promise.resolve();
  return anime(target, {
    translateX: [-6, 6, -5, 5, -3, 3, 0],
    duration: 450,
    easing: cubicBezier(0.55, 0.06, 0.68, 0.19),
    ...options,
  });
}

export function useAnimation() {
  const cleanupRef = useRef([]);

  const addCleanup = useCallback((fn) => {
    cleanupRef.current.push(fn);
  }, []);

  useEffect(() => {
    return () => {
      cleanupRef.current.forEach(fn => fn());
      cleanupRef.current = [];
    };
  }, []);

  return { addCleanup };
}

export function useScrollReveal(options = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options;
  const elementRef = useRef(null);
  const animatedRef = useRef(false);
  const transformedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || animatedRef.current) return;
    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      if (options.onComplete) options.onComplete();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (once && animatedRef.current) return;
          animatedRef.current = true;
          el.style.opacity = '1';
          el.style.transform = 'none';
          animateEntrance(el, { delay: options.delay || 0 }).then(() => {
            if (options.onComplete) options.onComplete();
          });
          if (once) observer.unobserve(el);
        }
      });
    }, { threshold, rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, options.delay, options.onComplete]);

  const callbackRef = useCallback((el) => {
    if (el) {
      if (!animatedRef.current && !transformedRef.current) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        transformedRef.current = true;
      }
      elementRef.current = el;
    }
  }, []);

  return callbackRef;
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(media.matches);
    const handler = (e) => setReduce(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);
  return reduce;
}
