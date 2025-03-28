import { initializeGoogleMaps } from './googleMapsLoader';

export interface RouteDetails {
  distance: string;
  duration: string;
  route: google.maps.DirectionsResult;
}

export interface PlaceDetails {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

let directionsService: google.maps.DirectionsService | null = null;
let geocoder: google.maps.Geocoder | null = null;
let placesService: google.maps.places.PlacesService | null = null;

const initializeServices = async () => {
  if (!directionsService || !geocoder) {
    await initializeGoogleMaps();
    directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();
    
    // Initialize PlacesService with a dummy div (required by Google Maps)
    const dummyDiv = document.createElement('div');
    placesService = new google.maps.places.PlacesService(dummyDiv);
  }
};

export const getRouteDetails = async (
  origin: string,
  destination: string
): Promise<RouteDetails | null> => {
  await initializeServices();
  
  try {
    const result = await directionsService!.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const route = result.routes[0].legs[0];
    return {
      distance: route.distance?.text || '',
      duration: route.duration?.text || '',
      route: result
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
};

export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  await initializeServices();

  return new Promise((resolve, reject) => {
    placesService!.getDetails(
      { placeId, fields: ['geometry', 'formatted_address'] },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result?.geometry?.location) {
          resolve({
            latitude: result.geometry.location.lat(),
            longitude: result.geometry.location.lng(),
            formattedAddress: result.formatted_address || ''
          });
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  await initializeServices();

  try {
    const result = await geocoder!.geocode({
      location: { lat: latitude, lng: longitude }
    });

    if (result.results[0]) {
      return result.results[0].formatted_address;
    }
    throw new Error('No address found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to get address from location');
  }
};