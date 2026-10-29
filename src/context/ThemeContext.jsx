import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    tag: 'Blueprint',
    desc: 'Architectural graphite with cobalt precision',
    isDark: true,
    colors: {
      bg: '#08090d',
      panel: '#0f121a',
      accent: '#3b82f6',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    tag: 'Gothic',
    desc: 'Vampiric twilight with neon purple & pink',
    isDark: true,
    colors: {
      bg: '#1e1f29',
      panel: '#282a36',
      accent: '#bd93f9',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Matrix Cyber',
    tag: 'Terminal',
    desc: 'High-contrast black with phosphor emerald',
    isDark: true,
    colors: {
      bg: '#050806',
      panel: '#0c1711',
      accent: '#10b981',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    tag: 'Twilight',
    desc: 'Deep midnight navy with neon cyan & sky',
    isDark: true,
    colors: {
      bg: '#13141f',
      panel: '#1a1b26',
      accent: '#7aa2f7',
    },
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    tag: 'Arctic',
    desc: 'Scandinavian polar slate & ice cyan',
    isDark: true,
    colors: {
      bg: '#202530',
      panel: '#2e3440',
      accent: '#88c0d0',
    },
  },
  {
    id: 'amber',
    name: 'Amber CRT',
    tag: 'Retro Synth',
    desc: 'Vintage monochrome CRT amber & warm gold',
    isDark: true,
    colors: {
      bg: '#0e0b07',
      panel: '#1a130b',
      accent: '#f59e0b',
    },
  },
  {
    id: 'light',
    name: 'Clean Studio',
    tag: 'Paper',
    desc: 'Pristine studio canvas & international blue',
    isDark: false,
    colors: {
      bg: '#f8fafc',
      panel: '#ffffff',
      accent: '#2563eb',
    },
  },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('hubspace_theme');
      if (saved) {
        // Migration if user had old 'dark' value
        if (saved === 'dark') return 'obsidian';
        // Validate saved matches one of our themes
        if (THEMES.some((t) => t.id === saved)) return saved;
      }
      return 'obsidian'; // Default theme
    } catch {
      return 'obsidian';
    }
  });

  const activeThemeMeta = THEMES.find((t) => t.id === theme) || THEMES[0];
  const isDark = activeThemeMeta.isDark;

  useEffect(() => {
    const root = document.documentElement;

    // Apply data-theme attribute for CSS variable switching
    root.setAttribute('data-theme', theme);

    // Apply dark class so Tailwind's dark: modifiers continue working
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('hubspace_theme', theme);
    } catch (e) {
      console.warn('LocalStorage error saving theme:', e);
    }
  }, [theme, isDark]);

  // Quick cycle through available themes
  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex].id);
  };

  // Toggle between current dark theme and light theme
  const toggleTheme = () => {
    if (isDark) {
      setTheme('light');
    } else {
      setTheme('obsidian');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        cycleTheme,
        isDark,
        activeThemeMeta,
        availableThemes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
