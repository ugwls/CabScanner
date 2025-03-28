import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

interface AuthButtonsProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export function AuthButtons({ onSignInClick, onSignUpClick }: AuthButtonsProps) {
  const { theme } = useTheme();

  return (
    <div className="p-3 space-y-1">
      <button
        onClick={onSignInClick}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-2 rounded-lg",
          "transition-colors",
          theme === 'dark'
            ? "hover:bg-gray-800 text-gray-300"
            : "hover:bg-gray-50 text-gray-700"
        )}
      >
        <LogIn size={20} className={theme === 'dark' ? "text-gray-400" : "text-gray-600"} />
        <span>Sign In</span>
      </button>
      <button
        onClick={onSignUpClick}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-2 rounded-lg",
          "transition-colors",
          theme === 'dark'
            ? "hover:bg-gray-800 text-gray-300"
            : "hover:bg-gray-50 text-gray-700"
        )}
      >
        <UserPlus size={20} className={theme === 'dark' ? "text-gray-400" : "text-gray-600"} />
        <span>Create Account</span>
      </button>
    </div>
  );
}