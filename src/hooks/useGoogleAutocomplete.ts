import { useState, useEffect } from 'react';
import { initializeGoogleMaps } from '../services/googleMapsLoader';

export interface Place {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry?: {
    location?: google.maps.LatLng;
  };
}

export function useGoogleAutocomplete() {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.AutocompleteService | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeGoogleMaps();
        setAutocomplete(new google.maps.places.AutocompleteService());
        setIsLoaded(true);

        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.error('Error getting user location:', error);
            }
          );
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    init();
  }, []);

  const getPlacePredictions = async (input: string = ''): Promise<Place[]> => {
    if (!autocomplete || !isLoaded || !input.trim()) return [];

    try {
      const options: google.maps.places.AutocompletionRequest = {
        input: input.trim(),
        componentRestrictions: { country: 'IN' },
        types: ['geocode', 'establishment'],
      };

      // Add location bias if user location is available
      if (userLocation) {
        options.locationBias = {
          center: userLocation,
          radius: 50000 // 50km radius
        };
      }

      const response = await autocomplete.getPlacePredictions(options);
      return response.predictions as Place[];
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  };

  return { getPlacePredictions, isLoaded, userLocation };
}