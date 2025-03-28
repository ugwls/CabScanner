import React, { useState, useEffect, useRef } from 'react';
import { useGoogleAutocomplete, type Place } from '../../hooks/useGoogleAutocomplete';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';

interface LocationInputProps {
  value: string;
  onChange: (value: string, place?: Place) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function LocationInput({ 
  value, 
  onChange, 
  placeholder, 
  className,
  required 
}: LocationInputProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { getPlacePredictions } = useGoogleAutocomplete();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Fetch initial predictions when input is focused
  useEffect(() => {
    const fetchInitialPredictions = async () => {
      if (isFocused) {
        const results = await getPlacePredictions(inputValue);
        setPredictions(results);
        setIsOpen(true);
      }
    };

    fetchInitialPredictions();
  }, [isFocused]);

  // Update predictions when input changes
  useEffect(() => {
    const fetchPredictions = async () => {
      if (isFocused) {
        const results = await getPlacePredictions(inputValue);
        setPredictions(results);
        setIsOpen(true);
      } else {
        setPredictions([]);
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, getPlacePredictions, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handlePlaceSelect = (place: Place) => {
    setInputValue(place.description);
    onChange(place.description, place);
    setIsOpen(false);
    setIsFocused(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full px-4 py-2 rounded-lg",
          "border",
          "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          theme === 'dark'
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
          className
        )}
      />
      
      {isOpen && predictions.length > 0 && (
        <div className={cn(
          "absolute z-50 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-auto",
          theme === 'dark'
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        )}>
          {predictions.map((place) => (
            <button
              key={place.place_id}
              className={cn(
                "w-full text-left px-4 py-2",
                "hover:bg-gray-50 transition-colors",
                theme === 'dark'
                  ? "hover:bg-gray-700 text-white"
                  : "hover:bg-gray-50 text-gray-900"
              )}
              onClick={() => handlePlaceSelect(place)}
            >
              <div className="font-medium">
                {place.structured_formatting.main_text}
              </div>
              <div className={cn(
                "text-sm",
                theme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
                {place.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}