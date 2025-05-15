import React, { useEffect } from 'react';
import useThemeStore from '../../store/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDarkMode, userPreference, syncWithSystemPreference, setDarkMode } = useThemeStore();

  useEffect(() => {
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user preference is set to system
      if (userPreference === 'system') {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [userPreference, setDarkMode]);

  useEffect(() => {
    // Apply transition class before changing theme
    document.documentElement.classList.add('transition-colors');
    document.documentElement.classList.add('duration-300');
    
    // Apply or remove dark class based on theme state
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
};

export default ThemeProvider; 