import React from 'react';
import { Car, Clock, MapPin } from 'lucide-react';
import { formatPrice } from '../../../lib/utils';
import type { SavedRide } from '../types';
import { useTheme } from '../../../hooks/useTheme';
import { cn } from '../../../lib/utils';

interface RideCardProps {
  ride: SavedRide;
}

export function RideCard({ ride }: RideCardProps) {
  const { theme } = useTheme();
  const date = new Date(ride.created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div className={cn(
      "rounded-lg shadow-sm border p-4",
      theme === 'dark' 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-100"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <LocationDisplay 
            icon={<MapPin className="w-4 h-4 text-blue-500" />}
            location={ride.pickup_location}
            theme={theme}
          />
          <LocationDisplay 
            icon={<MapPin className="w-4 h-4 text-red-500" />}
            location={ride.dropoff_location}
            theme={theme}
          />
        </div>
        <div className="text-right">
          <div className={cn(
            "font-medium",
            theme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {formatPrice(ride.price)}
          </div>
          <div className={cn(
            "text-sm",
            theme === 'dark' ? "text-gray-400" : "text-gray-500"
          )}>
            {ride.provider}
          </div>
          <div className={cn(
            "text-xs mt-1",
            theme === 'dark' ? "text-gray-500" : "text-gray-400"
          )}>
            {formattedDate}
          </div>
        </div>
      </div>
      <RideDetails distance={ride.distance} duration={ride.duration} theme={theme} />
    </div>
  );
}

function LocationDisplay({ 
  icon, 
  location,
  theme
}: { 
  icon: React.ReactNode; 
  location: string;
  theme: 'light' | 'dark';
}) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <span className={cn(
        "text-sm",
        theme === 'dark' ? "text-gray-300" : "text-gray-700"
      )}>
        {location}
      </span>
    </div>
  );
}

function RideDetails({ 
  distance, 
  duration,
  theme
}: { 
  distance: string; 
  duration: string;
  theme: 'light' | 'dark';
}) {
  return (
    <div className={cn(
      "mt-3 pt-3 border-t flex items-center justify-between text-sm",
      theme === 'dark' 
        ? "border-gray-700 text-gray-400" 
        : "border-gray-100 text-gray-500"
    )}>
      <div className="flex items-center space-x-2">
        <Car className="w-4 h-4" />
        <span>{distance}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4" />
        <span>{duration}</span>
      </div>
    </div>
  );
}