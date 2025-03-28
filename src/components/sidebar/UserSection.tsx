import React from 'react';
import { User as UserType } from '@supabase/supabase-js';
import { User } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface UserSectionProps {
  user: UserType;
}

export function UserSection({ user }: UserSectionProps) {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "p-4 border-b",
      theme === 'dark' ? "border-gray-800" : "border-gray-100"
    )}>
      <div className="flex items-center space-x-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          theme === 'dark' ? "bg-blue-950" : "bg-blue-100"
        )}>
          <User 
            size={24} 
            className={theme === 'dark' ? "text-blue-400" : "text-blue-500"} 
          />
        </div>
        <div>
          <div className={cn(
            "font-medium",
            theme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {user.email?.split('@')[0]}
          </div>
          <div className={cn(
            "text-sm",
            theme === 'dark' ? "text-gray-400" : "text-gray-500"
          )}>
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}