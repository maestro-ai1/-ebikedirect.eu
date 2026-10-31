import React from 'react';

export type GlyphVariant = 'mtb' | 'trekking' | 'city' | 'speed' | 'cargo' | 'all';

// Line drawing of an e-bike built from simple geometry, used as tile art.
// Same construction for every type so the set reads as one family; small details differ.
export function BikeGlyph({ variant, className }: { variant: GlyphVariant; className?: string }) {
  const long = variant === 'cargo';
  const rear = long ? 52 : 70;
  const front = 232;
  const bb = long ? 128 : 140;
  const wheelR = variant === 'mtb' ? 48 : variant === 'city' ? 44 : 46;
  return (
    <svg viewBox="0 0 300 170" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx={rear} cy="112" r={wheelR} />
      <circle cx={front} cy="112" r={wheelR} />
      <circle cx={rear} cy="112" r="4" fill="currentColor" />
      <circle cx={front} cy="112" r="4" fill="currentColor" />
      {/* frame */}
      <path d={`M${rear} 112L${bb} 112L${bb - 16} 60L${rear} 112`} />
      <path d={`M${bb - 16} 60L206 54L${bb} 112`} />
      <path d={`M206 54L${front} 112`} />
      {/* handlebar and saddle */}
      <path d="M206 54L200 36M190 34h24" />
      <path d={`M${bb - 16} 60L${bb - 20} 44M${bb - 30} 43h20`} />
      {/* motor at the crank and battery on the down tube */}
      <rect x={bb - 9} y="104" width="18" height="16" rx="4" fill="#FF5722" stroke="none" />
      <path d={`M${bb + 6} 102L196 62`} stroke="#00C853" strokeWidth="7" />
      {variant === 'mtb' && <path d={`M${bb - 12} 88l12 -14`} strokeWidth="5" />}
      {variant === 'speed' && <path d="M206 54l30 -10" />}
      {variant === 'cargo' && <rect x="8" y="58" width="58" height="26" rx="3" />}
      {variant === 'trekking' && <path d={`M${rear - 10} 80L${rear + 24} 80M${rear - 10} 86L${rear + 22} 86`} />}
      {variant === 'all' && <path d={`M${rear - 40} 164h${front - rear + 80}`} strokeWidth="1.5" />}
    </svg>
  );
}
