import React, { useEffect, useRef } from 'react';
import { animateFloat, animateBreathe, animateSuccessBurst, prefersReducedMotion } from '@/lib/animation';

const C = {
  body: '#5BB421',
  bodyDark: '#47971A',
  belly: '#7ED23A',
  leaf: '#47971A',
  ink: '#3f3f3f',
  foot: '#FF9600',
  cheek: '#FF9600',
  water: '#1CB0F6',
  sun: '#FFC800',
  sunDark: '#E5A500',
  grape: '#A560F8',
};

function Eyes({ kind }) {
  if (kind === 'happy-closed') {
    return (
      <g stroke={C.ink} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M56 78 Q64 69 72 78" />
        <path d="M88 78 Q96 69 104 78" />
      </g>
    );
  }
  const pupil = kind === 'thinking' ? -4 : kind === 'warning' ? 2 : 0;
  return (
    <g>
      <circle cx="64" cy="78" r="11" fill="#fff" />
      <circle cx="96" cy="78" r="11" fill="#fff" />
      <circle cx="64" cy={78 + pupil} r="5" fill={C.ink} />
      <circle cx="96" cy={78 + pupil} r="5" fill={C.ink} />
      <circle cx="66" cy={76 + pupil} r="1.8" fill="#fff" />
      <circle cx="98" cy={76 + pupil} r="1.8" fill="#fff" />
    </g>
  );
}

function Brows({ kind }) {
  if (kind === 'warning') {
    return (
      <g stroke={C.ink} strokeWidth="4" strokeLinecap="round">
        <path d="M55 62 L72 67" />
        <path d="M105 62 L88 67" />
      </g>
    );
  }
  if (kind === 'confused') {
    return (
      <g stroke={C.ink} strokeWidth="4" strokeLinecap="round">
        <path d="M56 63 Q64 60 71 63" />
        <path d="M89 58 Q96 54 104 58" />
      </g>
    );
  }
  if (kind === 'thinking') {
    return (
      <g stroke={C.ink} strokeWidth="4" strokeLinecap="round">
        <path d="M56 64 Q64 61 71 64" />
        <path d="M89 60 Q96 56 104 60" />
      </g>
    );
  }
  return null;
}

function Mouth({ kind }) {
  switch (kind) {
    case 'open':
      return (
        <g>
          <path d="M64 94 Q80 120 96 94 Q80 102 64 94 Z" fill={C.ink} />
          <ellipse cx="80" cy="103" rx="7" ry="4" fill="#FF8A80" />
        </g>
      );
    case 'o':
      return <circle cx="80" cy="100" r="5.5" fill={C.ink} />;
    case 'wavy':
      return <path d="M66 100 Q73 95 80 100 Q87 105 94 100" stroke={C.ink} strokeWidth="4" strokeLinecap="round" fill="none" />;
    case 'tilt':
      return <path d="M68 101 Q80 96 92 103" stroke={C.ink} strokeWidth="4" strokeLinecap="round" fill="none" />;
    default:
      return <path d="M66 95 Q80 108 94 95" stroke={C.ink} strokeWidth="4" strokeLinecap="round" fill="none" />;
  }
}

function Sparkles({ color = C.sun }) {
  return (
    <g fill={color}>
      <path d="M28 34 l3.5 7 7 3.5 -7 3.5 -3.5 7 -3.5 -7 -7 -3.5 7 -3.5 Z" />
      <path d="M132 26 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 Z" />
      <path d="M138 96 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 Z" />
      <circle cx="20" cy="86" r="3.5" />
    </g>
  );
}

function SweatDrop() {
  return <path d="M128 52 C 135 63 137 71 130 76 C 123 71 123 61 128 52 Z" fill={C.water} />;
}

function WateringCan() {
  return (
    <g>
      <rect x="116" y="86" width="28" height="22" rx="7" fill="#8FA3AD" />
      <path d="M118 92 L104 102 L108 108 L120 100 Z" fill="#8FA3AD" />
      <path d="M142 90 Q152 96 144 106" stroke="#8FA3AD" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="114" r="3" fill={C.water} />
      <circle cx="94" cy="122" r="3" fill={C.water} />
      <circle cx="104" cy="124" r="3" fill={C.water} />
    </g>
  );
}

function Medal() {
  return (
    <g>
      <path d="M72 104 L80 116 L88 104 L84 100 L76 100 Z" fill="#FF4B4B" />
      <circle cx="80" cy="118" r="10" fill={C.sun} stroke={C.sunDark} strokeWidth="3" />
      <path d="M80 112 l2 4 4.5 0.7 -3.2 3.2 0.7 4.4 -4 -2.1 -4 2.1 0.7 -4.4 -3.2 -3.2 4.5 -0.7 Z" fill="#fff" />
    </g>
  );
}

const MOODS = {
  happy: { eyes: 'open', mouth: 'smile' },
  thinking: { eyes: 'thinking', mouth: 'o', brows: 'thinking' },
  warning: { eyes: 'warning', mouth: 'wavy', brows: 'warning', sweat: true },
  celebrating: { eyes: 'happy-closed', mouth: 'open', sparkles: true, armsUp: true },
  helping: { eyes: 'open', mouth: 'open', armsUp: true },
  watering: { eyes: 'open', mouth: 'smile', can: true },
  growing: { eyes: 'happy-closed', mouth: 'smile', sparkles: true, sproutBig: true },
  confused: { eyes: 'open', mouth: 'tilt', brows: 'confused', question: true },
  successful: { eyes: 'happy-closed', mouth: 'smile', medal: true, sparkles: true },
};

export default function KisaanMascot({ mood = 'happy', className = '' }) {
  const m = MOODS[mood] || MOODS.happy;
  const sproutScale = m.sproutBig ? 1.25 : 1;
  const bodyRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!bodyRef.current) return;

    const cleanup = [];

    if (mood === 'happy' || mood === 'growing' || mood === 'celebrating' || mood === 'successful') {
      const floatAnim = animateFloat(bodyRef.current);
      cleanup.push(() => floatAnim?.pause?.());
    }

    if (mood === 'happy' || mood === 'celebrating') {
      const breatheAnim = animateBreathe(bodyRef.current);
      cleanup.push(() => breatheAnim?.pause?.());
    }

    if (mood === 'successful') {
      animateSuccessBurst(bodyRef.current);
    }

    return () => {
      cleanup.forEach(fn => fn?.());
    };
  }, [mood]);

  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-label="Kisaan mascot" ref={bodyRef}>
      <ellipse cx="80" cy="146" rx="42" ry="8" fill={C.ink} opacity="0.08" />
      {m.sparkles && <Sparkles />}
      {m.sweat && <SweatDrop />}
      {m.question && (
        <text x="126" y="46" fontSize="26" fontWeight="900" fill={C.grape} fontFamily="Nunito, sans-serif">?</text>
      )}
      {/* feet */}
      <ellipse cx="62" cy="140" rx="11" ry="6.5" fill={C.foot} />
      <ellipse cx="98" cy="140" rx="11" ry="6.5" fill={C.foot} />
      {/* arms */}
      {m.armsUp ? (
        <g>
          <path d="M40 84 C 28 76 22 66 26 56 C 36 58 44 68 46 78 Z" fill={C.leaf} />
          <path d="M120 84 C 132 76 138 66 134 56 C 124 58 116 68 114 78 Z" fill={C.leaf} />
        </g>
      ) : (
        <g>
          <path d="M38 90 C 26 86 18 90 15 98 C 23 105 34 102 41 96 Z" fill={C.leaf} />
          <path d="M122 90 C 134 86 142 90 145 98 C 137 105 126 102 119 96 Z" fill={C.leaf} />
        </g>
      )}
      {/* body */}
      <path d="M80 38 C 111 38 126 64 126 92 C 126 122 106 140 80 140 C 54 140 34 122 34 92 C 34 64 49 38 80 38 Z" fill={C.body} />
      <path d="M80 38 C 111 38 126 64 126 92 C 126 100 124.5 107 122 113 C 116 84 104 66 80 66 C 56 66 44 84 38 113 C 35.5 107 34 100 34 92 C 34 64 49 38 80 38 Z" fill={C.bodyDark} opacity="0.35" />
      <ellipse cx="80" cy="108" rx="27" ry="21" fill={C.belly} opacity="0.55" />
      {/* head sprout */}
      <g transform={`translate(80 40) scale(${sproutScale}) translate(-80 -40)`}>
        <path d="M80 40 C 80 32 80 28 80 22" stroke={C.leaf} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M80 26 C 70 12 52 12 48 21 C 54 32 70 33 80 26 Z" fill={C.leaf} />
        <path d="M80 26 C 90 10 108 10 112 19 C 106 31 90 33 80 26 Z" fill={C.body} />
      </g>
      {/* face */}
      <Brows kind={m.brows} />
      <Eyes kind={m.eyes} />
      <circle cx="52" cy="92" r="6" fill={C.cheek} opacity="0.35" />
      <circle cx="108" cy="92" r="6" fill={C.cheek} opacity="0.35" />
      <Mouth kind={m.mouth} />
      {m.medal && <Medal />}
      {m.can && <WateringCan />}
    </svg>
  );
}