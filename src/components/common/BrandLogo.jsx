import React from 'react';

export default function BrandLogo({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${className}`}
      title="HubSpace Atlas"
    >
      {/* Light Theme: Black Dragon Logo */}
      <img
        src={`${baseUrl}logo-light.png`}
        alt="HubSpace Dragon Logo"
        className="w-full h-full object-contain block dark:hidden select-none pointer-events-none drop-shadow-sm"
        draggable={false}
      />
      {/* Dark Theme: White / Silver Dragon Logo */}
      <img
        src={`${baseUrl}logo-dark.png`}
        alt="HubSpace Dragon Logo"
        className="w-full h-full object-contain hidden dark:block select-none pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]"
        draggable={false}
      />
    </div>
  );
}

