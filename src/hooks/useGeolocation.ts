import { useState, useCallback } from 'react';
import { getAddressFromCoords } from '../services/maps';

interface GeolocationState {
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
  });

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Geolocation is not supported by your browser' });
      return null;
    }

    setState({ loading: true, error: null });

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      const address = await getAddressFromCoords(latitude, longitude);
      
      setState({ loading: false, error: null });
      return address;
    } catch (error) {
      setState({ 
        loading: false, 
        error: error instanceof GeolocationPositionError 
          ? getGeolocationErrorMessage(error)
          : 'Failed to get your location'
      });
      return null;
    }
  }, []);

  return { ...state, getCurrentLocation };
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Please allow location access to use this feature';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable';
    case error.TIMEOUT:
      return 'Location request timed out';
    default:
      return 'Failed to get your location';
  }
}