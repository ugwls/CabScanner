import { useState, useEffect } from 'react';
import { useGoogleAutocomplete, type Place } from './useGoogleAutocomplete';
import { getPlaceDetails } from '../services/maps';

interface UseLocationSelectionProps {
  value: string;
  onChange: (value: string, place?: Place) => void;
}

export function useLocationSelection({ value, onChange }: UseLocationSelectionProps) {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getPlacePredictions } = useGoogleAutocomplete();

  // Update internal state when prop changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
      handleAutoComplete(value);
    }
  }, [value]);

  const handleAutoComplete = async (searchValue: string) => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await getPlacePredictions(searchValue);
      if (results.length > 0) {
        // Automatically select the first result
        const firstPlace = results[0];
        handlePlaceSelect(firstPlace, true);
      }
    } catch (error) {
      console.error('Error auto-completing location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    
    if (newValue.trim()) {
      fetchPredictions(newValue);
    } else {
      setPredictions([]);
      setIsOpen(false);
    }
  };

  const fetchPredictions = async (searchValue: string) => {
    if (!searchValue.trim()) return;
    
    const results = await getPlacePredictions(searchValue);
    setPredictions(results);
    setIsOpen(true);
  };

  const handlePlaceSelect = async (place: Place, isAutoComplete = false) => {
    setInputValue(place.description);
    onChange(place.description, place);
    
    if (!isAutoComplete) {
      setIsOpen(false);
      setIsFocused(false);
    }

    // Get additional place details
    try {
      const details = await getPlaceDetails(place.place_id);
      if (details) {
        // You can use these details for additional functionality
        console.log('Place details:', details);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return {
    inputValue,
    predictions,
    isOpen,
    isFocused,
    isLoading,
    setIsOpen,
    setIsFocused,
    handleInputChange,
    handlePlaceSelect,
    handleAutoComplete
  };
}