import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { X, User, Settings, Clock, MapPin, LogOut, Home, Heart } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { UserSection } from './UserSection';
import { AuthButtons } from './AuthButtons';
import { RideHistory } from '../../features/rides/components/RideHistory';
import { SavedPlaces } from '../../features/places/components/SavedPlaces';
import { SettingsSection } from '../settings/SettingsSection';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick: (mode: 'signin' | 'signup') => void;
  onPlaceSelect?: (address: string) => void;
}

export function Sidebar({ isOpen, onClose, onAuthClick, onPlaceSelect }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = React.useState<'home' | 'history' | 'places' | 'settings'>('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'history':
        return <RideHistory />;
      case 'places':
        return <SavedPlaces onPlaceSelect={onPlaceSelect} />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed top-0 left-0 h-full w-72 z-50",
        "transform transition-transform duration-300 ease-in-out",
        "shadow-xl flex flex-col",
        theme === 'dark' ? "bg-gray-900" : "bg-white",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className={cn(
          "flex items-center justify-between p-4",
          "border-b",
          theme === 'dark' ? "border-gray-800" : "border-gray-100"
        )}>
          <h2 className={cn(
            "text-xl font-semibold",
            theme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            CabScanner
          </h2>
          <button 
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg",
              theme === 'dark'
                ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
            )}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {user ? (
            <>
              <UserSection user={user} />
              <div className="p-3 space-y-1">
                <SidebarLink 
                  icon={Home} 
                  label="Home" 
                  isActive={activeSection === 'home'}
                  onClick={() => setActiveSection('home')}
                />
                <SidebarLink 
                  icon={Clock} 
                  label="Ride History" 
                  isActive={activeSection === 'history'}
                  onClick={() => setActiveSection('history')}
                />
                <SidebarLink 
                  icon={MapPin} 
                  label="Saved Places" 
                  isActive={activeSection === 'places'}
                  onClick={() => setActiveSection('places')}
                />
                <SidebarLink 
                  icon={Settings} 
                  label="Settings" 
                  isActive={activeSection === 'settings'}
                  onClick={() => setActiveSection('settings')}
                />
                <button
                  onClick={() => signOut()}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-2 rounded-lg",
                    "text-red-600 transition-colors",
                    theme === 'dark'
                      ? "hover:bg-red-950"
                      : "hover:bg-red-50"
                  )}
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
              {renderContent()}
            </>
          ) : (
            <AuthButtons
              onSignInClick={() => onAuthClick('signin')}
              onSignUpClick={() => onAuthClick('signup')}
            />
          )}
        </div>

        {/* Made with love footer */}
        <div className={cn(
          "p-4 border-t text-center text-sm",
          theme === 'dark'
            ? "border-gray-800 text-gray-400"
            : "border-gray-100 text-gray-500"
        )}>
          <div className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-current" />
            <span>by Ujjwal Sharma</span>
          </div>
        </div>
      </div>
    </>
  );
}