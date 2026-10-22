import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { getFaviconUrl, extractDomain } from '../../utils/urlHelper';

export default function FaviconImage({ url, title, className = 'w-5 h-5', fallbackClass = 'w-5 h-5 text-indigo-400' }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const faviconSrc = url ? getFaviconUrl(url, 128) : '';
  const domain = extractDomain(url || '');

  if (!url || hasError || !faviconSrc) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300 font-semibold text-xs select-none ${className}`}
        title={domain || title}
      >
        {title ? title.charAt(0).toUpperCase() : <Globe className={fallbackClass} />}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center rounded-lg bg-slate-200/50 dark:bg-slate-800/50 animate-pulse`}>
          <Globe className={`${fallbackClass} opacity-40`} />
        </div>
      )}
      <img
        src={faviconSrc}
        alt={domain || title || 'Icon'}
        className={`rounded-lg object-contain transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

