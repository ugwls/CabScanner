import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { addSavedPlace } from '../api/savedPlaces';
import { toast } from 'react-hot-toast';
import { LocationInput } from '../../../components/common/LocationInput';
import type { Place } from '../../../hooks/useGoogleAutocomplete';
import { getPlaceDetails } from '../../../services/maps';
import { useTheme } from '../../../hooks/useTheme';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded: () => void;
}

export function AddPlaceModal({ isOpen, onClose, onPlaceAdded }: AddPlaceModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleAddressChange = async (_: string, place?: Place) => {
    if (place) {
      setAddress(place.description);
      setSelectedPlace(place);
      // If no name is set yet, use the main text as the name
      if (!name) {
        setName(place.structured_formatting.main_text);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlace) {
      toast.error('Please select a valid address');
      return;
    }

    try {
      const placeDetails = await getPlaceDetails(selectedPlace.place_id);
      if (!placeDetails) {
        toast.error('Could not get location details');
        return;
      }

      await addSavedPlace({
        name,
        address: selectedPlace.description,
        latitude: placeDetails.latitude,
        longitude: placeDetails.longitude
      });

      toast.success('Place saved successfully');
      onPlaceAdded();
      onClose();
      setName('');
      setAddress('');
      setSelectedPlace(null);
    } catch (error) {
      toast.error('Failed to save place');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={cn(
        "rounded-2xl shadow-xl w-full max-w-md",
        theme === 'dark' ? "bg-gray-800" : "bg-white"
      )}>
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          theme === 'dark' ? "border-gray-700" : "border-gray-100"
        )}>
          <h2 className={cn(
            "text-xl font-semibold",
            theme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            Add New Place
          </h2>
          <button 
            onClick={onClose} 
            className={theme === 'dark' ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={cn(
              "block text-sm font-medium mb-1",
              theme === 'dark' ? "text-gray-300" : "text-gray-700"
            )}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full px-4 py-2 rounded-lg",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                theme === 'dark' 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-200 text-gray-900"
              )}
              required
            />
          </div>

          <div>
            <label className={cn(
              "block text-sm font-medium mb-1",
              theme === 'dark' ? "text-gray-300" : "text-gray-700"
            )}>
              Address
            </label>
            <LocationInput
              value={address}
              onChange={handleAddressChange}
              placeholder="Search for a location"
              className={theme === 'dark' ? "bg-gray-700 border-gray-600 text-white" : ""}
              required
            />
          </div>

          <button
            type="submit"
            className={cn(
              "w-full py-2 px-4 rounded-lg",
              "bg-blue-500 text-white font-medium",
              "hover:bg-blue-600 transition-colors"
            )}
          >
            Save Place
          </button>
        </form>
      </div>
    </div>
  );
}