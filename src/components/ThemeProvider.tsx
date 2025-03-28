import React from 'react';
import { ThemeContext, useThemeProvider } from '../hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeContext = useThemeProvider();
  
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
}