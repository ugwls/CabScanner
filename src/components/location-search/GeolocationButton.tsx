import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGeolocation } from '../../hooks/useGeolocation';
import { toast } from 'react-hot-toast';

interface GeolocationButtonProps {
  onLocationDetected: (address: string) => void;
}

export function GeolocationButton({ onLocationDetected }: GeolocationButtonProps) {
  const { loading, getCurrentLocation } = useGeolocation();

  const handleClick = async () => {
    const address = await getCurrentLocation();
    if (address) {
      onLocationDetected(address);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "p-2 rounded-lg border border-gray-200",
        "hover:bg-gray-50 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        loading && "animate-pulse"
      )}
      title="Use current location"
    >
      <MapPin 
        className={cn(
          "w-5 h-5",
          loading ? "text-blue-500" : "text-gray-500"
        )}
      />
    </button>
  );
}