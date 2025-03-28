import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if user has already seen the prompt
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
    if (hasSeenPrompt) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className={cn(
        "bg-white rounded-xl shadow-lg p-4",
        "border border-gray-100",
        "animate-slide-up"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Install CabScanner</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add CabScanner to your home screen for quick access to compare cab prices anytime.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg",
              "border border-gray-200",
              "text-gray-700 text-sm font-medium",
              "hover:bg-gray-50 transition-colors"
            )}
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg",
              "bg-blue-500 text-white text-sm font-medium",
              "hover:bg-blue-600 transition-colors",
              "flex items-center justify-center gap-2"
            )}
          >
            <Download size={18} />
            Install
          </button>
        </div>
      </div>
    </div>
  );
}