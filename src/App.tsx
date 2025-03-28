import React, { useState, useEffect } from 'react';
import { MapView } from './components/map';
import { PriceComparison } from './components/price-comparison';
import { LocationSearch } from './components/location-search/LocationSearch';
import { AuthModal } from './components/auth/AuthModal';
import { Sidebar } from './components/sidebar/Sidebar';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { SpeedDial } from './features/rides/components/SpeedDial';
import { Menu } from 'lucide-react';
import { useRideHistory } from './features/rides/hooks/useRideHistory';
import { Toaster } from 'react-hot-toast';
import { validateLocations, type LocationValidationResult } from './services/validation';
import { fetchRidePrices, formatRideOptions } from './services/rides';
import type { RideOption } from './types/ride';
import type { Place } from './hooks/useGoogleAutocomplete';
import type { RouteDetails } from './services/maps';
import { toast } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import { cn } from './lib/utils';

export default function App() {
  const { theme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupPlace, setPickupPlace] = useState<Place>();
  const [dropoffPlace, setDropoffPlace] = useState<Place>();
  const [validatedLocations, setValidatedLocations] = useState<LocationValidationResult>({ isValid: false });
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [rideLinks, setRideLinks] = useState<any>(null);
  const [pendingRouteCalculation, setPendingRouteCalculation] = useState(false);
  const { saveRideToHistory } = useRideHistory();

  const generateRideLinks = async () => {
    if (!pickupPlace || !dropoffPlace || !validatedLocations.isValid) {
      toast.error('Please select both pickup and dropoff locations from the suggestions.');
      return null;
    }

    const pickupData = {
      addressLine1: pickup,
      addressLine2: pickup,
      id: pickupPlace.place_id,
      latitude: validatedLocations.pickup!.latitude,
      longitude: validatedLocations.pickup!.longitude,
    };

    const dropoffData = {
      addressLine1: dropoff,
      addressLine2: dropoff,
      id: dropoffPlace.place_id,
      latitude: validatedLocations.dropoff!.latitude,
      longitude: validatedLocations.dropoff!.longitude,
    };

    const uberLink = `https://m.uber.com/go/product-selection?drop%5B0%5D=${encodeURIComponent(JSON.stringify(dropoffData))}&pickup=${encodeURIComponent(JSON.stringify(pickupData))}&vehicle=2019`;

    const olaLink = `https://book.olacabs.com/?serviceType=p2p&utm_source=widget_on_olacabs&drop_lat=${dropoffData.latitude}&drop_lng=${dropoffData.longitude}&drop_name=${encodeURIComponent(dropoff)}&lat=${pickupData.latitude}&lng=${pickupData.longitude}&pickup_name=${encodeURIComponent(pickup)}&pickup=`;

    const rapidoData = {
      pickupLocation: {
        lat: validatedLocations.pickup!.latitude,
        lng: validatedLocations.pickup!.longitude
      },
      dropLocation: {
        lat: validatedLocations.dropoff!.latitude,
        lng: validatedLocations.dropoff!.longitude
      },
      customer: "67bda9ddfb42731aac8e99ca" // Default customer ID
    };

    return { 
      uber_link: uberLink, 
      ola_link: olaLink,
      rapido_data: rapidoData
    };
  };

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handlePickupChange = (value: string, place?: Place) => {
    setPickup(value);
    setPickupPlace(place);
    validateAndUpdateLocations(value, dropoff, place, dropoffPlace);
  };

  const handleDropoffChange = (value: string, place?: Place) => {
    setDropoff(value);
    setDropoffPlace(place);
    validateAndUpdateLocations(pickup, value, pickupPlace, place);
  };

  const validateAndUpdateLocations = async (
    newPickup: string,
    newDropoff: string,
    newPickupPlace?: Place,
    newDropoffPlace?: Place
  ) => {
    const result = await validateLocations(
      newPickup,
      newDropoff,
      newPickupPlace,
      newDropoffPlace
    );
    setValidatedLocations(result);
    
    if (!result.isValid) {
      setRouteDetails(null);
      setRideOptions([]);
    } else if (newPickup && newDropoff) {
      // If both locations are valid, set a flag to calculate the route
      setPendingRouteCalculation(true);
    }
  };

  // Effect to handle pending route calculations
  useEffect(() => {
    if (pendingRouteCalculation && validatedLocations.isValid) {
      // Reset the flag
      setPendingRouteCalculation(false);
      
      // The MapView component will handle the route calculation
      // when it detects valid locations
    }
  }, [pendingRouteCalculation, validatedLocations.isValid]);

  const handlePlaceSelect = (address: string) => {
    setDropoff(address);
    setIsSidebarOpen(false);
  };

  const handleRouteCalculated = async (details: RouteDetails) => {
    setRouteDetails(details);
    if (!validatedLocations.isValid) return;

    setIsLoadingPrices(true);
    try {
      const links = await generateRideLinks();
      if (!links) {
        setIsLoadingPrices(false);
        return;
      }

      setRideLinks(links);
      const prices = await fetchRidePrices(links);
      const options = formatRideOptions(prices);
      setRideOptions(options);
    } catch (error) {
      console.error('Error fetching ride prices:', error);
      toast.error('Failed to fetch ride prices. Please try again.');
      setRideOptions([]);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handleRideSelect = (ride: RideOption) => {
    if (routeDetails && validatedLocations.isValid) {
      try {
        saveRideToHistory(ride, routeDetails, {
          pickup: validatedLocations.pickup!.address,
          dropoff: validatedLocations.dropoff!.address
        });
      } catch (error) {
        console.error('Error in handleRideSelect:', error);
        toast.error('Failed to save ride. Please try again.');
      }
    }
  };

  const handleSpeedDialSelect = async (pickupLocation: string, dropoffLocation: string) => {
    setPickup(pickupLocation);
    setDropoff(dropoffLocation);

    try {
      const result = await validateLocations(pickupLocation, dropoffLocation);
      setValidatedLocations(result);

      if (result.isValid) {
        setPickupPlace({ description: pickupLocation, place_id: '', structured_formatting: { main_text: '', secondary_text: '' } });
        setDropoffPlace({ description: dropoffLocation, place_id: '', structured_formatting: { main_text: '', secondary_text: '' } });
        
        // Set the flag to trigger route calculation
        setPendingRouteCalculation(true);
      }
    } catch (error) {
      console.error('Error validating locations:', error);
      toast.error('Failed to validate locations. Please try again.');
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 flex flex-col overflow-hidden",
      theme === 'dark' ? "bg-gray-900" : "bg-gray-50"
    )}>
      <Toaster position="top-center" />
      <InstallPrompt />
      
      {/* Main Content Area */}
      <div className="relative flex-1">
        {/* Map Container - Base Layer */}
        <div className="absolute inset-0">
          <MapView
            pickup={validatedLocations.pickup?.address}
            dropoff={validatedLocations.dropoff?.address}
            onRouteCalculated={handleRouteCalculated}
            pendingCalculation={pendingRouteCalculation}
          />
        </div>
        
        {/* UI Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Location Search with Hamburger Menu */}
          <div className="pointer-events-auto">
            <div className={cn(
              "absolute inset-x-0 top-2 sm:top-4 mx-3 sm:mx-4",
              "backdrop-blur-md rounded-xl shadow-lg",
              theme === 'dark' ? "bg-gray-800/90" : "bg-white/90"
            )}>
              <div className="flex items-start p-3 sm:p-4 space-x-2 sm:space-x-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className={cn(
                    "p-2 rounded-lg self-center",
                    theme === 'dark' 
                      ? "hover:bg-gray-700 text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  <Menu size={20} />
                </button>
                
                <div className="flex-1">
                  <LocationSearch
                    pickup={pickup}
                    dropoff={dropoff}
                    onPickupChange={handlePickupChange}
                    onDropoffChange={handleDropoffChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Speed Dial */}
          <div className="pointer-events-auto">
            <SpeedDial onRouteSelect={handleSpeedDialSelect} />
          </div>

          {/* Price Comparison - Conditionally shown */}
          {validatedLocations.isValid && routeDetails && (
            <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
              <PriceComparison
                options={rideOptions}
                onSelect={handleRideSelect}
                isLoading={isLoadingPrices}
                links={rideLinks}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals and Overlays - Top Layer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAuthClick={handleAuthClick}
        onPlaceSelect={handlePlaceSelect}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}