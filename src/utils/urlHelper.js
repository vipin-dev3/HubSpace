/**
 * Utility functions for URL parsing, cleaning, and favicon fetching
 */

export function extractDomain(url) {
  try {
    let clean = url.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    // Fallback if parsing fails
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^:/\s]+)/i);
    return match ? match[1] : url;
  }
}

export function formatUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function getFaviconUrl(url, size = 64) {
  const domain = extractDomain(url);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

export function isValidUrl(url) {
  if (!url) return false;
  try {
    const formatted = formatUrl(url);
    const parsed = new URL(formatted);
    return parsed.hostname.length > 0 && parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

