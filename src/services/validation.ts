import { getPlaceDetails } from './maps';
import type { Place } from '../hooks/useGoogleAutocomplete';

export interface ValidLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export interface LocationValidationResult {
  isValid: boolean;
  pickup?: ValidLocation;
  dropoff?: ValidLocation;
}

export async function validateLocations(
  pickup: string,
  dropoff: string,
  pickupPlace?: Place,
  dropoffPlace?: Place
): Promise<LocationValidationResult> {
  // If either field is empty, return invalid
  if (!pickup || !dropoff) {
    return { isValid: false };
  }

  // If we have places, validate them
  const pickupDetails = pickupPlace 
    ? await getPlaceDetails(pickupPlace.place_id)
    : null;
  
  const dropoffDetails = dropoffPlace
    ? await getPlaceDetails(dropoffPlace.place_id)
    : null;

  // Both locations must have valid coordinates
  if (!pickupDetails || !dropoffDetails) {
    return { isValid: false };
  }

  return {
    isValid: true,
    pickup: {
      address: pickup,
      latitude: pickupDetails.latitude,
      longitude: pickupDetails.longitude
    },
    dropoff: {
      address: dropoff,
      latitude: dropoffDetails.latitude,
      longitude: dropoffDetails.longitude
    }
  };
}