import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeProvider() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>(() => {
    // If user is not logged in, always return light theme
    if (!user) return 'light';

    // For logged in users, check local storage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    // If no saved theme, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update theme when auth state changes
  useEffect(() => {
    if (!user) {
      setTheme('light');
    } else {
      // Restore saved theme when user logs in
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    }
  }, [user]);

  useEffect(() => {
    // Only save theme to localStorage if user is logged in
    if (user) {
      localStorage.setItem('theme', theme);
    }
    // Always update document class
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, user]);

  const toggleTheme = () => {
    // Only allow theme toggle if user is logged in
    if (user) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }
  };

  return { theme, toggleTheme };
}