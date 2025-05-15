import React, { useState, useRef, useEffect } from 'react';
import { HiSun, HiMoon, HiDesktopComputer, HiChevronDown } from 'react-icons/hi';
import useThemeStore from '../../store/themeStore';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDarkMode, userPreference, setUserPreference } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getIcon = () => {
    if (userPreference === 'system') {
      return <HiDesktopComputer className="h-5 w-5" />;
    } 
    return isDarkMode ? <HiMoon className="h-5 w-5" /> : <HiSun className="h-5 w-5" />;
  };

  const getLabel = () => {
    if (userPreference === 'system') return 'System';
    return isDarkMode ? 'Dark' : 'Light';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 p-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDarkMode 
            ? 'bg-dark-surface text-gray-300 hover:bg-gray-700 focus:ring-primary-400 focus:ring-offset-gray-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-primary-500 focus:ring-offset-white'
        }`}
        aria-label="Theme settings"
      >
        {getIcon()}
        <span className="sr-only md:not-sr-only md:inline-block text-sm font-medium">
          {getLabel()}
        </span>
        <HiChevronDown className="h-4 w-4 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 z-10">
          <button
            onClick={() => {
              setUserPreference('light');
              setIsOpen(false);
            }}
            className={`flex items-center px-4 py-2 text-sm w-full text-left ${
              userPreference === 'light' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <HiSun className="mr-3 h-5 w-5" />
            Light
          </button>
          
          <button
            onClick={() => {
              setUserPreference('dark');
              setIsOpen(false);
            }}
            className={`flex items-center px-4 py-2 text-sm w-full text-left ${
              userPreference === 'dark' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <HiMoon className="mr-3 h-5 w-5" />
            Dark
          </button>
          
          <button
            onClick={() => {
              setUserPreference('system');
              setIsOpen(false);
            }}
            className={`flex items-center px-4 py-2 text-sm w-full text-left ${
              userPreference === 'system' 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <HiDesktopComputer className="mr-3 h-5 w-5" />
            System
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle; 