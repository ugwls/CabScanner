import React from 'react';
import { LocationInput } from './LocationInput';
import { GeolocationButton } from './GeolocationButton';
import type { Place } from '../../hooks/useGoogleAutocomplete';

interface SearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, place?: Place) => void;
  icon: React.ReactNode;
}

export function SearchInput({ label, placeholder, value, onChange, icon }: SearchInputProps) {
  const handleLocationDetected = (address: string) => {
    onChange(address);
  };

  return (
    <div className="flex w-full gap-1.5 sm:gap-2">
      <GeolocationButton onLocationDetected={handleLocationDetected} />
      <div className="flex-1">
        <LocationInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          icon={icon}
        />
      </div>
    </div>
  );
}