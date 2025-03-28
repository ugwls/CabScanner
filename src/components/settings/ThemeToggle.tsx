import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-3">
            <Sun className="w-5 h-5" />
            <span className="font-medium">Light Mode</span>
          </div>
          <p className="text-sm">Sign in to customize theme</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-lg",
        "transition-colors",
        theme === 'dark'
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-white hover:bg-gray-50 border border-gray-200"
      )}
    >
      <div className="flex items-center space-x-3">
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
        <span className="font-medium">
          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>
      <div className={cn(
        "w-11 h-6 rounded-full relative transition-colors",
        theme === 'dark' ? "bg-blue-500" : "bg-gray-200"
      )}>
        <div className={cn(
          "absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform",
          theme === 'dark' ? "translate-x-5" : "translate-x-0.5"
        )} />
      </div>
    </button>
  );
}