import React from 'react';
import { cn } from '../../lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarLink({ icon: Icon, label, isActive, onClick }: SidebarLinkProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-4 py-2 rounded-lg",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
        isActive
          ? theme === 'dark'
            ? "bg-blue-950 text-blue-400"
            : "bg-blue-50 text-blue-600"
          : theme === 'dark'
            ? "hover:bg-gray-800 text-gray-300"
            : "hover:bg-gray-50 text-gray-700"
      )}
    >
      <Icon 
        size={20} 
        className={isActive 
          ? theme === 'dark' ? "text-blue-400" : "text-blue-600"
          : theme === 'dark' ? "text-gray-400" : "text-gray-600"
        } 
      />
      <span>{label}</span>
    </button>
  );
}