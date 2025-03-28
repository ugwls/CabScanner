import React, { useRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2, X } from 'lucide-react';
import { useLocationSelection } from '../../hooks/useLocationSelection';
import type { Place } from '../../hooks/useGoogleAutocomplete';
import { useTheme } from '../../hooks/useTheme';

interface LocationInputProps {
  value: string;
  onChange: (value: string, place?: Place) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function LocationInput({ 
  value, 
  onChange, 
  placeholder,
  icon,
  className 
}: LocationInputProps) {
  const { theme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    inputValue,
    predictions,
    isOpen,
    isFocused,
    isLoading,
    setIsFocused,
    handleInputChange,
    handlePlaceSelect
  } = useLocationSelection({ value, onChange });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleInputChange('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        {icon && (
          <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(
            "w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base",
            "transition-all duration-200",
            "pr-8 sm:pr-10",
            icon && "pl-8 sm:pl-10",
            theme === 'dark' ? [
              "bg-gray-700 border-gray-600",
              "text-white placeholder-gray-400",
              "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            ] : [
              "bg-white border-gray-200",
              "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            ],
            className
          )}
        />
        <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 animate-spin" />
          )}
          {inputValue && !isLoading && (
            <button
              onClick={handleClear}
              className={cn(
                "p-0.5 sm:p-1 rounded-full",
                theme === 'dark'
                  ? "hover:bg-gray-600 text-gray-400"
                  : "hover:bg-gray-100 text-gray-400"
              )}
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
      
      {isOpen && predictions.length > 0 && isFocused && (
        <div className={cn(
          "absolute z-50 w-full mt-1 rounded-lg shadow-lg border max-h-60 overflow-auto",
          theme === 'dark'
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        )}>
          {predictions.map((place) => (
            <button
              key={place.place_id}
              onClick={() => handlePlaceSelect(place)}
              className={cn(
                "w-full text-left px-3 sm:px-4 py-2",
                "transition-colors",
                theme === 'dark'
                  ? "hover:bg-gray-700 text-white"
                  : "hover:bg-gray-50 text-gray-900"
              )}
            >
              <div className="font-medium text-xs sm:text-sm">
                {place.structured_formatting.main_text}
              </div>
              <div className={cn(
                "text-xs",
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