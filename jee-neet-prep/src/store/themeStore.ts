import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
  syncWithSystemPreference: () => void;
  userPreference: 'light' | 'dark' | 'system';
  setUserPreference: (preference: 'light' | 'dark' | 'system') => void;
}

// Check if system prefers dark mode
const systemPrefersDark = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: systemPrefersDark(),
      userPreference: 'system' as 'light' | 'dark' | 'system',
      
      toggleTheme: () => {
        const newMode = !get().isDarkMode;
        set({ 
          isDarkMode: newMode, 
          userPreference: newMode ? 'dark' : 'light'
        });
      },
      
      setDarkMode: (isDark: boolean) => set({ 
        isDarkMode: isDark,
        userPreference: isDark ? 'dark' : 'light'
      }),
      
      syncWithSystemPreference: () => {
        set({ 
          isDarkMode: systemPrefersDark(),
          userPreference: 'system'
        });
      },
      
      setUserPreference: (preference: 'light' | 'dark' | 'system') => {
        if (preference === 'system') {
          set({ 
            userPreference: 'system',
            isDarkMode: systemPrefersDark()
          });
        } else {
          set({ 
            userPreference: preference,
            isDarkMode: preference === 'dark'
          });
        }
      }
    }),
    { name: 'theme-storage' }
  )
);

export default useThemeStore; 