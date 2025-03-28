import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getRideHistory } from '../api';
import { useTheme } from '../../../hooks/useTheme';

interface SpeedDialProps {
  onRouteSelect: (pickup: string, dropoff: string) => void;
}

export function SpeedDial({ onRouteSelect }: SpeedDialProps) {
  const { theme } = useTheme();
  const { data: rides } = useQuery({
    queryKey: ['rides'],
    queryFn: getRideHistory
  });

  // Get unique routes from ride history
  const frequentRoutes = React.useMemo(() => {
    if (!rides) return [];
    
    const routes = rides.reduce((acc, ride) => {
      const key = `${ride.pickup_location}|${ride.dropoff_location}`;
      if (!acc[key]) {
        acc[key] = {
          pickup: ride.pickup_location,
          dropoff: ride.dropoff_location,
          count: 1
        };
      } else {
        acc[key].count++;
      }
      return acc;
    }, {} as Record<string, { pickup: string; dropoff: string; count: number }>);

    return Object.values(routes)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Show top 3 most frequent routes
  }, [rides]);

  if (!frequentRoutes.length) return null;

  return (
    <div className="absolute top-32 sm:top-36 right-3 sm:right-4 flex space-x-2">
      {frequentRoutes.map((route, index) => (
        <button
          key={index}
          onClick={() => onRouteSelect(route.pickup, route.dropoff)}
          className={cn(
            "flex items-center justify-center",
            "w-12 h-12 rounded-full shadow-lg",
            "transition-colors",
            "group relative",
            theme === 'dark'
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
              : "bg-white border border-gray-100 hover:bg-gray-50"
          )}
          title={`${route.pickup} → ${route.dropoff}`}
        >
          <Clock className={cn(
            "w-5 h-5",
            theme === 'dark' ? "text-gray-300" : "text-gray-600"
          )} />
          
          {/* Tooltip */}
          <div className={cn(
            "absolute top-full mt-2 px-3 py-2",
            "text-sm rounded-lg shadow-lg",
            "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
            "transition-all duration-200",
            "whitespace-nowrap max-w-xs",
            "left-1/2 -translate-x-1/2", // Center the tooltip
            theme === 'dark'
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-white"
          )}>
            <div className="font-medium">{route.pickup}</div>
            <div className={theme === 'dark' ? "text-gray-400" : "text-gray-300"}>to</div>
            <div className="font-medium">{route.dropoff}</div>
          </div>
        </button>
      ))}
    </div>
  );
}