import React, { useState } from 'react';
import { MapPin, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { SavedPlace } from '../types';
import { EditPlaceModal } from './EditPlaceModal';
import { toast } from 'react-hot-toast';
import { deleteSavedPlace } from '../api/savedPlaces';
import { useTheme } from '../../../hooks/useTheme';

interface PlaceCardProps {
  place: SavedPlace;
  onClick?: () => void;
  onUpdate: () => void;
}

export function PlaceCard({ place, onClick, onUpdate }: PlaceCardProps) {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this place?')) return;

    try {
      await deleteSavedPlace(place.id);
      toast.success('Place deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete place');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <>
      <div className="relative">
        <div
          onClick={onClick}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-lg border",
            "transition-colors cursor-pointer",
            theme === 'dark' 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
              : "bg-white border-gray-100 hover:bg-gray-50"
          )}
        >
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              theme === 'dark' ? "bg-gray-700" : "bg-gray-50"
            )}>
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <div className={cn(
                "font-medium",
                theme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {place.name}
              </div>
              <div className={cn(
                "text-sm",
                theme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
                {place.address}
              </div>
            </div>
          </div>
          <div 
            onClick={handleMenuClick}
            className={cn(
              "p-2 rounded-lg cursor-pointer",
              theme === 'dark' 
                ? "hover:bg-gray-600 text-gray-400" 
                : "hover:bg-gray-100 text-gray-500"
            )}
          >
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>

        {showMenu && (
          <div className={cn(
            "absolute right-2 top-14 rounded-lg shadow-lg border py-1 z-10",
            theme === 'dark'
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          )}>
            <button
              onClick={handleEditClick}
              className={cn(
                "w-full flex items-center space-x-2 px-4 py-2 text-left",
                theme === 'dark'
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className={cn(
                "w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600",
                theme === 'dark'
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-50"
              )}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <EditPlaceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        place={place}
        onPlaceUpdated={() => {
          onUpdate();
          setShowEditModal(false);
        }}
      />
    </>
  );
}