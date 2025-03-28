import React from 'react';
import { SearchInput } from './SearchInput';
import { MapPin, Navigation2 } from 'lucide-react';
import type { Place } from '../../hooks/useGoogleAutocomplete';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface LocationSearchProps {
  pickup: string;
  dropoff: string;
  onPickupChange: (location: string, place?: Place) => void;
  onDropoffChange: (location: string, place?: Place) => void;
}

export function LocationSearch({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange
}: LocationSearchProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-start space-x-2 sm:space-x-3">
        <div className="flex flex-col items-center space-y-1 pt-3">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <div className={cn(
            "w-0.5 h-12",
            theme === 'dark' ? "bg-gray-600" : "bg-gray-300"
          )} />
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>
        <div className="flex-1 space-y-2 sm:space-y-3">
          <SearchInput
            label="Pickup"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={onPickupChange}
            icon={<Navigation2 className="h-4 w-4 text-blue-500" />}
          />
          <SearchInput
            label="Dropoff"
            placeholder="Where to?"
            value={dropoff}
            onChange={onDropoffChange}
            icon={<MapPin className="h-4 w-4 text-red-500" />}
          />
        </div>
      </div>
    </div>
  );
}