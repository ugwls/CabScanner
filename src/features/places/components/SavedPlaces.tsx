import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getSavedPlaces } from '../api/savedPlaces';
import { AddPlaceModal } from './AddPlaceModal';
import { PlaceCard } from './PlaceCard';
import type { SavedPlace } from '../types';
import { useTheme } from '../../../hooks/useTheme';

interface SavedPlacesProps {
  onPlaceSelect?: (address: string) => void;
}

export function SavedPlaces({ onPlaceSelect }: SavedPlacesProps) {
  const { theme } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: places, isLoading, error, refetch } = useQuery({
    queryKey: ['saved-places'],
    queryFn: getSavedPlaces
  });

  if (isLoading) {
    return <div className={cn(
      "p-4 text-center",
      theme === 'dark' ? "text-gray-400" : "text-gray-500"
    )}>Loading places...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Failed to load places</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => setIsAddModalOpen(true)}
        className={cn(
          "w-full flex items-center space-x-3 p-4 rounded-lg",
          "border transition-colors",
          theme === 'dark'
            ? "bg-blue-900/20 text-blue-400 border-blue-800/50 hover:bg-blue-900/30"
            : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
        )}
      >
        <Plus className="w-5 h-5" />
        <span>Add New Place</span>
      </button>

      <div className="space-y-2">
        {places?.map((place) => (
          <PlaceCard 
            key={place.id} 
            place={place} 
            onClick={() => onPlaceSelect?.(place.address)}
            onUpdate={refetch}
          />
        ))}
      </div>

      <AddPlaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPlaceAdded={() => {
          refetch();
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}