import React from 'react';
import { DeleteAccountButton } from './DeleteAccountButton';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

export function SettingsSection() {
  const { signOut } = useAuth();
  const { theme } = useTheme();

  const handleAccountDeleted = () => {
    signOut();
  };

  return (
    <div className={cn(
      "p-4 space-y-6",
      theme === 'dark' ? "text-white" : "text-gray-900"
    )}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <p className={cn(
          "text-sm",
          theme === 'dark' ? "text-gray-400" : "text-gray-500"
        )}>
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Appearance</h4>
          <ThemeToggle />
        </div>

        <div className={cn(
          "p-4 rounded-lg space-y-3",
          theme === 'dark' ? "bg-red-900" : "bg-red-50"
        )}>
          <h4 className={cn(
            "font-medium",
            theme === 'dark' ? "text-red-50" : "text-red-900"
          )}>
            Danger Zone
          </h4>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? "text-red-200" : "text-red-700"
          )}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <DeleteAccountButton onDeleted={handleAccountDeleted} />
        </div>
      </div>
    </div>
  );
}