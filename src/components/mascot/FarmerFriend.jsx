import React from 'react';

const C = {
  skin: '#C68642',
  skinDark: '#A96F32',
  turban: '#FF9600',
  turbanDark: '#E07E00',
  ink: '#3f3f3f',
  shirt: '#5BB421',
  shirtDark: '#47971A',
  white: '#ffffff',
};

export default function FarmerFriend({ variant = 'wave', className = '' }) {
  return (
    <svg viewBox="0 0 160 160" className={className} role="img" aria-label="Farmer friend">
      <ellipse cx="80" cy="148" rx="44" ry="7" fill={C.ink} opacity="0.08" />
      {/* body */}
      <path d="M48 148 C 48 116 62 104 80 104 C 98 104 112 116 112 148 Z" fill={C.shirt} />
      <path d="M80 104 L80 148" stroke={C.shirtDark} strokeWidth="3" />
      {/* arms */}
      {variant === 'cheer' ? (
        <g>
          <path d="M52 118 C 40 108 34 96 36 86" stroke={C.shirt} strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M108 118 C 120 108 126 96 124 86" stroke={C.shirt} strokeWidth="12" strokeLinecap="round" fill="none" />
          <circle cx="36" cy="82" r="8" fill={C.skin} />
          <circle cx="124" cy="82" r="8" fill={C.skin} />
        </g>
      ) : (
        <g>
          <path d="M52 120 C 44 128 42 136 44 144" stroke={C.shirt} strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M108 118 C 120 110 128 100 128 88" stroke={C.shirt} strokeWidth="12" strokeLinecap="round" fill="none" />
          <circle cx="128" cy="84" r="8" fill={C.skin} />
        </g>
      )}
      {/* head */}
      <circle cx="80" cy="70" r="30" fill={C.skin} />
      <circle cx="70" cy="76" r="4" fill={C.skinDark} opacity="0.4" />
      <circle cx="90" cy="76" r="4" fill={C.skinDark} opacity="0.4" />
      {/* turban */}
      <path d="M50 62 C 50 40 64 32 80 32 C 96 32 110 40 110 62 C 96 54 64 54 50 62 Z" fill={C.turban} />
      <path d="M50 62 C 64 54 96 54 110 62 C 96 58 64 58 50 62 Z" fill={C.turbanDark} />
      <circle cx="80" cy="38" r="6" fill={C.turbanDark} />
      {/* eyes */}
      {variant === 'cheer' ? (
        <g stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d="M64 68 Q69 63 74 68" />
          <path d="M86 68 Q91 63 96 68" />
        </g>
      ) : (
        <g fill={C.ink}>
          <circle cx="69" cy="67" r="3.5" />
          <circle cx="91" cy="67" r="3.5" />
        </g>
      )}
      {/* mustache + smile */}
      <path d="M68 82 C 74 78 78 78 80 81 C 82 78 86 78 92 82 C 88 87 82 87 80 85 C 78 87 72 87 68 82 Z" fill={C.ink} />
      <path d="M74 90 Q80 94 86 90" stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
