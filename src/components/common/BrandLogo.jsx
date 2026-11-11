import React from 'react';
import logoLight from '../../assets/logo-light.png';
import logoDark from '../../assets/logo-dark.png';

export default function BrandLogo({ className = 'w-9 h-9 sm:w-10 sm:h-10' }) {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${className}`}
      title="HubSpace Atlas"
    >
      {/* Light Theme: Black Silhouette Logo */}
      <img
        src={logoLight}
        alt="HubSpace Logo"
        className="w-full h-full object-contain block dark:hidden select-none pointer-events-none drop-shadow-sm"
        draggable={false}
      />
      {/* Dark Theme: Luminous White Silhouette Logo */}
      <img
        src={logoDark}
        alt="HubSpace Logo"
        className="w-full h-full object-contain hidden dark:block select-none pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.22)]"
        draggable={false}
      />
    </div>
  );
}

