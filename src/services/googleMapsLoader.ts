import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../config/constants';

let loadPromise: Promise<void> | null = null;

export const initializeGoogleMaps = async () => {
  if (!loadPromise) {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geometry", "marker"],
      mapIds: ['b1526b28cad1818c'] // Your Map ID
    });
    
    loadPromise = loader.load();
  }
  
  return loadPromise;
};