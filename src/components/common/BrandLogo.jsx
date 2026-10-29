import React from 'react';

export default function BrandLogo({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm ${className}`}
    >
      <rect x="5" y="5" width="90" height="90" rx="20" fill="#0B0F19" stroke="#1E293B" strokeWidth="2" />
      
      {/* Concentric Rings */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="#1E293B" strokeWidth="2" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="6 4" />

      {/* Radar Crosshairs */}
      <line x1="50" y1="12" x2="50" y2="22" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="78" x2="50" y2="88" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="50" x2="22" y2="50" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      <line x1="78" y1="50" x2="88" y2="50" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />

      {/* Center Core */}
      <circle cx="50" cy="50" r="7" fill="#3B82F6" />
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" />

      {/* Satellite Point */}
      <circle cx="64" cy="36" r="4" fill="#60A5FA" />
    </svg>
  );
}

