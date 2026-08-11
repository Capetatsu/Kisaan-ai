import React from 'react';

const backgrounds = {
  wheat: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.7" />
      <ellipse cx="340" cy="30" rx="22" ry="12" fill="white" opacity="0.9" />
      <ellipse cx="325" cy="28" rx="16" ry="10" fill="white" opacity="0.85" />
      <ellipse cx="355" cy="28" rx="14" ry="9" fill="white" opacity="0.85" />
      <ellipse cx="120" cy="22" rx="18" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="105" cy="20" rx="12" ry="8" fill="white" opacity="0.8" />
      <ellipse cx="135" cy="20" rx="11" ry="7" fill="white" opacity="0.8" />
      <ellipse cx="260" cy="16" rx="14" ry="8" fill="white" opacity="0.85" />
      <path d="M0 110 Q80 80 160 100 Q240 80 320 95 Q360 88 400 92 L400 200 L0 200Z" fill="#C8A84E" opacity="0.75" />
      <path d="M0 120 Q60 100 140 115 Q220 95 300 108 Q360 100 400 105 L400 200 L0 200Z" fill="#D4B85E" opacity="0.7" />
      <path d="M0 135 Q100 120 200 130 Q300 118 400 125 L400 200 L0 200Z" fill="#E8C84E" opacity="0.65" />
      {[15,35,55,75,95,115,135,155,175,195,215,235,255,275,295,315,335,355,375,395].map((x, i) => {
        const h = 30 + (i % 4) * 6;
        const y = 138 + (i % 3) * 4;
        return (
          <g key={`f${i}`} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2={`-${h}`} stroke="#A0843C" strokeWidth="1.5" strokeLinecap="round" />
            <path d={`M0,-${h} Q-4,-${h-8} -2,-${h-14}`} stroke="#C8A040" strokeWidth="1.2" fill="none" />
            <path d={`M0,-${h} Q4,-${h-8} 2,-${h-14}`} stroke="#C8A040" strokeWidth="1.2" fill="none" />
            <ellipse cx="0" cy={`-${h+2}`} rx="3" ry="7" fill="#D4B050" />
            <ellipse cx="-2" cy={`-${h}`} rx="2.5" ry="5" fill="#C8A040" transform={`rotate(-12 -2 -${h})`} />
            <ellipse cx="2" cy={`-${h}`} rx="2.5" ry="5" fill="#C8A040" transform={`rotate(12 2 -${h})`} />
          </g>
        );
      })}
      {[25,65,105,145,185,225,265,305,345,385].map((x, i) => {
        const h = 22 + (i % 3) * 5;
        const y = 145 + (i % 2) * 5;
        return (
          <g key={`b${i}`} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2={`-${h}`} stroke="#8B7030" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="0" cy={`-${h+1}`} rx="2.5" ry="5.5" fill="#BFA040" />
            <ellipse cx="-1.5" cy={`-${h-1}`} rx="2" ry="4" fill="#BFA040" transform={`rotate(-10 -1.5 -${h-1})`} />
            <ellipse cx="1.5" cy={`-${h-1}`} rx="2" ry="4" fill="#BFA040" transform={`rotate(10 1.5 -${h-1})`} />
          </g>
        );
      })}
    </svg>
  ),

  tomato: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="100" cy="24" rx="16" ry="9" fill="white" opacity="0.9" />
      <ellipse cx="300" cy="18" rx="18" ry="10" fill="white" opacity="0.85" />
      <path d="M0 110 Q100 85 200 100 Q300 80 400 95 L400 200 L0 200Z" fill="#5BB421" opacity="0.7" />
      <path d="M0 130 Q80 115 180 125 Q280 110 400 120 L400 200 L0 200Z" fill="#47971A" opacity="0.65" />
      {[30,70,110,150,190,230,270,310,350].map((x, i) => {
        const y = 130 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-30" stroke="#47971A" strokeWidth="2" />
            <path d="M0,-28 Q-6,-22 -8,-30" stroke="#5BB421" strokeWidth="1.5" fill="#7ED23A" opacity="0.9" />
            <circle cx="-7" cy="-32" r="8" fill="#FF4B4B" opacity="1" />
            <circle cx="-7" cy="-34" r="5" fill="#FF6B6B" opacity="0.9" />
            <path d={`M${-7} ${-40} L${-5} ${-37} L${-9} ${-37} Z`} fill="#47971A" />
            <circle cx="8" cy="-26" r="6.5" fill="#FF5555" opacity="0.95" />
            <path d={`M${8} ${-32.5} L${10} ${-30} L${6} ${-30} Z`} fill="#47971A" />
          </g>
        );
      })}
    </svg>
  ),

  rice: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#B8E4F8" opacity="0.65" />
      <ellipse cx="320" cy="22" rx="16" ry="9" fill="white" opacity="0.85" />
      <ellipse cx="90" cy="18" rx="14" ry="8" fill="white" opacity="0.8" />
      <path d="M0 115 Q100 95 200 108 Q300 90 400 100 L400 200 L0 200Z" fill="#5BB421" opacity="0.65" />
      <rect x="0" y="130" width="400" height="70" fill="#1CB0F6" opacity="0.5" />
      <path d="M0 130 Q50 125 100 130 Q150 125 200 128 Q250 123 300 127 Q350 122 400 126 L400 145 Q350 140 300 142 Q250 138 200 141 Q150 137 100 140 Q50 136 0 138Z" fill="#1CB0F6" opacity="0.45" />
      {[25,55,85,115,145,175,205,235,265,295,325,355,385].map((x, i) => {
        const y = 125 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#7ED23A" strokeWidth="1.5" />
            <path d="M0,-32 Q-6,-25 -4,-18" stroke="#7ED23A" strokeWidth="1" fill="none" />
            <path d="M0,-28 Q6,-21 4,-14" stroke="#7ED23A" strokeWidth="1" fill="none" />
            <ellipse cx="-5" cy="-34" rx="2.5" ry="5" fill="#C8D84E" transform="rotate(-18 -5 -34)" />
            <ellipse cx="5" cy="-35" rx="2.5" ry="5" fill="#C8D84E" transform="rotate(18 5 -35)" />
            <ellipse cx="0" cy="-37" rx="2" ry="4" fill="#D4E060" />
          </g>
        );
      })}
    </svg>
  ),

  maize: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="280" cy="20" rx="20" ry="11" fill="white" opacity="0.9" />
      <ellipse cx="130" cy="25" rx="15" ry="8" fill="white" opacity="0.8" />
      <path d="M0 108 Q100 88 200 100 Q300 82 400 95 L400 200 L0 200Z" fill="#5BB421" opacity="0.7" />
      <path d="M0 128 Q80 115 180 125 Q280 110 400 120 L400 200 L0 200Z" fill="#47971A" opacity="0.6" />
      {[20,60,100,140,180,220,260,300,340,380].map((x, i) => {
        const y = 125 + (i % 3) * 6;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-48" stroke="#47971A" strokeWidth="2.5" />
            <path d="M0,-22 Q-14,-16 -18,-28" stroke="#5BB421" strokeWidth="2" fill="#7ED23A" opacity="0.9" />
            <path d="M0,-32 Q14,-26 17,-38" stroke="#5BB421" strokeWidth="2" fill="#7ED23A" opacity="0.9" />
            <path d="M0,-40 Q-10,-36 -12,-44" stroke="#5BB421" strokeWidth="1.5" fill="#7ED23A" opacity="0.85" />
            <ellipse cx="3" cy="-50" rx="3.5" ry="9" fill="#FFC800" opacity="1" />
            <ellipse cx="3" cy="-50" rx="2" ry="6" fill="#FFD840" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  ),

  cotton: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="300" cy="22" rx="18" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="110" cy="18" rx="14" ry="8" fill="white" opacity="0.85" />
      <path d="M0 112 Q100 92 200 105 Q300 88 400 98 L400 200 L0 200Z" fill="#5BB421" opacity="0.65" />
      <path d="M0 130 Q80 118 180 128 Q280 112 400 122 L400 200 L0 200Z" fill="#47971A" opacity="0.6" />
      {[30,80,130,180,230,280,330,370].map((x, i) => {
        const y = 128 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#6B4E1A" strokeWidth="2" />
            <circle cx="0" cy="-36" r="10" fill="white" opacity="1" />
            <circle cx="-5" cy="-38" r="5" fill="white" />
            <circle cx="5" cy="-38" r="5" fill="white" />
            <circle cx="0" cy="-33" r="5" fill="white" />
            <circle cx="-3" cy="-36" r="3" fill="#F5F5F5" />
            <circle cx="3" cy="-36" r="3" fill="#F5F5F5" />
            <path d="M0,-26 Q-10,-20 -14,-30" stroke="#47971A" strokeWidth="1.5" fill="#7ED23A" opacity="0.9" />
            <path d="M0,-28 Q10,-22 12,-32" stroke="#47971A" strokeWidth="1.5" fill="#7ED23A" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  ),

  onion: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="280" cy="20" rx="16" ry="9" fill="white" opacity="0.85" />
      <ellipse cx="100" cy="24" rx="14" ry="8" fill="white" opacity="0.8" />
      <path d="M0 115 Q100 95 200 108 Q300 90 400 100 L400 200 L0 200Z" fill="#5BB421" opacity="0.7" />
      <path d="M0 132 Q80 120 180 130 Q280 115 400 125 L400 200 L0 200Z" fill="#47971A" opacity="0.6" />
      {[25,65,105,145,185,225,265,305,345,385].map((x, i) => {
        const y = 135 + (i % 3) * 4;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <ellipse cx="0" cy="0" rx="10" ry="11" fill="#E8C84E" opacity="1" />
            <ellipse cx="0" cy="0" rx="7.5" ry="8.5" fill="#F0D860" opacity="0.9" />
            <ellipse cx="0" cy="-1" rx="4" ry="5" fill="#F8E870" opacity="0.8" />
            <line x1="0" y1="-11" x2="-3" y2="-30" stroke="#47971A" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="-11" x2="3" y2="-33" stroke="#5BB421" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M-3,-30 Q-6,-26 -8,-30" stroke="#5BB421" strokeWidth="1" fill="#7ED23A" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  ),

  potato: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="300" cy="20" rx="16" ry="9" fill="white" opacity="0.85" />
      <path d="M0 118 Q100 100 200 112 Q300 95 400 105 L400 200 L0 200Z" fill="#5BB421" opacity="0.65" />
      <path d="M0 135 Q80 125 180 133 Q280 120 400 128 L400 200 L0 200Z" fill="#8B6914" opacity="0.55" />
      {[30,80,130,180,230,280,330,370].map((x, i) => {
        const y = 140 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <ellipse cx="0" cy="0" rx="13" ry="9" fill="#C8A84E" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="10" ry="7" fill="#D4B85E" opacity="0.85" />
            <ellipse cx="-5" cy="-12" rx="5" ry="7" fill="#7ED23A" opacity="0.9" transform="rotate(-15 -5 -12)" />
            <ellipse cx="5" cy="-14" rx="4" ry="6" fill="#5BB421" opacity="0.85" transform="rotate(15 5 -14)" />
            <line x1="0" y1="-6" x2="0" y2="-22" stroke="#47971A" strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  ),

  chilli: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="310" cy="22" rx="16" ry="9" fill="white" opacity="0.85" />
      <ellipse cx="90" cy="20" rx="14" ry="8" fill="white" opacity="0.8" />
      <path d="M0 112 Q100 95 200 105 Q300 88 400 100 L400 200 L0 200Z" fill="#5BB421" opacity="0.7" />
      <path d="M0 130 Q80 118 180 128 Q280 112 400 122 L400 200 L0 200Z" fill="#47971A" opacity="0.6" />
      {[25,65,105,145,185,225,265,305,345,385].map((x, i) => {
        const y = 128 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-28" stroke="#47971A" strokeWidth="2" />
            <path d="M0,-28 Q-5,-34 -3,-42 Q0,-38 3,-42 Q5,-34 0,-28" fill="#FF4B4B" opacity="1" />
            <path d="M0,-28 L0,-24" stroke="#47971A" strokeWidth="1.5" />
            <path d="M0,-26 Q-8,-22 -10,-30" stroke="#5BB421" strokeWidth="1" fill="#7ED23A" opacity="0.9" />
            <circle cx="6" cy="-18" r="5" fill="#FF5555" opacity="0.95" />
            <path d={`M${6} ${-23} L${8} ${-20} L${4} ${-20} Z`} fill="#47971A" />
          </g>
        );
      })}
    </svg>
  ),

  mustard: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="300" cy="20" rx="18" ry="10" fill="white" opacity="0.9" />
      <ellipse cx="100" cy="24" rx="14" ry="8" fill="white" opacity="0.8" />
      <path d="M0 112 Q100 90 200 105 Q300 85 400 98 L400 200 L0 200Z" fill="#FFC800" opacity="0.6" />
      <path d="M0 128 Q80 115 180 125 Q280 108 400 120 L400 200 L0 200Z" fill="#5BB421" opacity="0.65" />
      {[20,50,80,110,140,170,200,230,260,290,320,350,380].map((x, i) => {
        const y = 125 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-30" stroke="#47971A" strokeWidth="1.5" />
            <circle cx="0" cy="-33" r="5.5" fill="#FFC800" opacity="1" />
            <circle cx="-3" cy="-31" r="3.5" fill="#FFD840" />
            <circle cx="3" cy="-31" r="3.5" fill="#FFD840" />
            <circle cx="0" cy="-35" r="3" fill="#FFE060" />
            <circle cx="0" cy="-33" r="1.5" fill="#E8A800" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  ),

  groundnut: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="290" cy="20" rx="16" ry="9" fill="white" opacity="0.85" />
      <path d="M0 118 Q100 100 200 112 Q300 95 400 105 L400 200 L0 200Z" fill="#5BB421" opacity="0.65" />
      <path d="M0 135 Q80 125 180 133 Q280 120 400 128 L400 200 L0 200Z" fill="#8B6914" opacity="0.5" />
      {[30,80,130,180,230,280,330].map((x, i) => {
        const y = 138 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <ellipse cx="-7" cy="0" rx="7" ry="5" fill="#C8A84E" opacity="0.95" />
            <ellipse cx="7" cy="0" rx="7" ry="5" fill="#C8A84E" opacity="0.95" />
            <line x1="0" y1="-6" x2="0" y2="-28" stroke="#47971A" strokeWidth="1.8" />
            <ellipse cx="-5" cy="-26" rx="6" ry="3.5" fill="#7ED23A" opacity="0.95" transform="rotate(-20 -5 -26)" />
            <ellipse cx="5" cy="-28" rx="6" ry="3.5" fill="#7ED23A" opacity="0.95" transform="rotate(20 5 -28)" />
          </g>
        );
      })}
    </svg>
  ),

  sugarcane: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="320" cy="22" rx="16" ry="9" fill="white" opacity="0.85" />
      <ellipse cx="100" cy="18" rx="14" ry="8" fill="white" opacity="0.8" />
      <path d="M0 108 Q100 88 200 100 Q300 82 400 95 L400 200 L0 200Z" fill="#5BB421" opacity="0.7" />
      <path d="M0 128 Q80 115 180 125 Q280 110 400 120 L400 200 L0 200Z" fill="#47971A" opacity="0.6" />
      {[25,70,115,160,205,250,295,340,385].map((x, i) => {
        const y = 122 + (i % 3) * 6;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <rect x="-2.5" y="-55" width="5" height="55" rx="2.5" fill="#8BC34A" opacity="0.95" />
            <rect x="-1.5" y="-53" width="3" height="50" rx="1.5" fill="#7ED23A" opacity="0.75" />
            <path d="M2.5,-35 Q14,-28 18,-40" stroke="#5BB421" strokeWidth="1.8" fill="#7ED23A" opacity="0.9" />
            <path d="M-2.5,-45 Q-14,-38 -16,-50" stroke="#5BB421" strokeWidth="1.8" fill="#7ED23A" opacity="0.9" />
            <path d="M2.5,-20 Q10,-16 12,-24" stroke="#5BB421" strokeWidth="1.2" fill="#7ED23A" opacity="0.85" />
          </g>
        );
      })}
    </svg>
  ),

  default: (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
      <rect width="400" height="200" fill="#87CEEB" opacity="0.65" />
      <ellipse cx="300" cy="22" rx="18" ry="10" fill="white" opacity="0.85" />
      <ellipse cx="100" cy="20" rx="14" ry="8" fill="white" opacity="0.8" />
      <path d="M0 115 Q100 95 200 108 Q300 90 400 100 L400 200 L0 200Z" fill="#5BB421" opacity="0.7" />
      <path d="M0 132 Q80 120 180 130 Q280 115 400 125 L400 200 L0 200Z" fill="#47971A" opacity="0.6" />
      {[30,80,130,180,230,280,330,370].map((x, i) => {
        const y = 128 + (i % 3) * 5;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <line x1="0" y1="0" x2="0" y2="-30" stroke="#47971A" strokeWidth="2" />
            <ellipse cx="-6" cy="-30" rx="6" ry="3.5" fill="#7ED23A" opacity="0.95" transform="rotate(-25 -6 -30)" />
            <ellipse cx="6" cy="-32" rx="6" ry="3.5" fill="#7ED23A" opacity="0.95" transform="rotate(25 6 -32)" />
            <ellipse cx="0" cy="-35" rx="5" ry="3" fill="#5BB421" opacity="0.9" />
          </g>
        );
      })}
    </svg>
  ),
};

const cropKeyMap = {
  wheat: 'wheat', tomato: 'tomato', onion: 'onion', soybean: 'default',
  rice: 'rice', maize: 'maize', cotton: 'cotton', sugarcane: 'sugarcane',
  potato: 'potato', chilli: 'chilli', mustard: 'mustard', groundnut: 'groundnut',
  '\u0917\u0947\u0939\u0942\u0902': 'wheat', '\u091F\u092E\u093E\u091F\u0930': 'tomato', '\u092A\u094D\u092F\u093E\u091C': 'onion', '\u0938\u094B\u092F\u093E\u092C\u0940\u0928': 'default',
  '\u091A\u093E\u0935\u0932': 'rice', '\u092E\u0915\u094D\u0915\u093E': 'maize', '\u0915\u092A\u093E\u0938': 'cotton', '\u0917\u0928\u094D\u0928\u093E': 'sugarcane',
  '\u0906\u0932\u0942': 'potato', '\u092E\u093F\u0930\u094D\u091A': 'chilli', '\u0938\u0930\u0938\u094B\u0902': 'mustard', '\u092E\u0942\u0902\u0917\u092B\u0932\u0940': 'groundnut',
};

export default function CropBackground({ cropName }) {
  const key = cropKeyMap[cropName?.toLowerCase()] || cropKeyMap[cropName] || 'default';
  return backgrounds[key] || backgrounds.default;
}
