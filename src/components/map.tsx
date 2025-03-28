import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { getRouteDetails, type RouteDetails } from '../services/maps';
import { initializeGoogleMaps } from '../services/googleMapsLoader';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-hot-toast';

interface MapViewProps {
  pickup?: string;
  dropoff?: string;
  onRouteCalculated?: (details: RouteDetails) => void;
  pendingCalculation?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

// Dark mode style from Google Maps
const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export function MapView({ pickup, dropoff, onRouteCalculated, pendingCalculation = false }: MapViewProps) {
  const { theme } = useTheme();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const previousRoute = useRef<string>('');
  const locationMarkerRef = useRef<google.maps.Marker | null>(null);
  const [pickupMarker, setPickupMarker] = useState<google.maps.Marker | null>(null);
  const [dropoffMarker, setDropoffMarker] = useState<google.maps.Marker | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Create marker icons
  const createPinIcon = (color: string) => ({
    path: 'M12 0C7.58 0 4 3.58 4 8c0 5.76 7.44 14.32 7.75 14.71.15.19.38.29.62.29.24 0 .47-.1.62-.29C13.31 22.32 20 13.76 20 8c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1.5,
    anchor: new google.maps.Point(12, 23),
    labelOrigin: new google.maps.Point(12, 9)
  });

  // Get user's location on initial load
  useEffect(() => {
    if (!map || !isLoaded) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userLocation);
          map.panTo(userLocation);
          map.setZoom(15);

          // Update or create the location marker
          if (locationMarkerRef.current) {
            locationMarkerRef.current.setPosition(userLocation);
          } else {
            locationMarkerRef.current = new google.maps.Marker({
              position: userLocation,
              map,
              icon: createPinIcon('#4285F4'),
              title: 'Your Location'
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Could not get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Please allow location access to use this feature';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, [map, isLoaded]);

  useEffect(() => {
    initializeGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch(error => setLoadError(error));

    // Cleanup function to remove markers
    return () => {
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setMap(null);
        locationMarkerRef.current = null;
      }
      if (pickupMarker) {
        pickupMarker.setMap(null);
      }
      if (dropoffMarker) {
        dropoffMarker.setMap(null);
      }
    };
  }, []);

  // Clear directions and markers when pickup or dropoff changes
  useEffect(() => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
    
    if (pickupMarker) {
      pickupMarker.setMap(null);
      setPickupMarker(null);
    }
    if (dropoffMarker) {
      dropoffMarker.setMap(null);
      setDropoffMarker(null);
    }
    
    setDirections(null);
    previousRoute.current = '';
  }, [pickup, dropoff]);

  // Handle route calculation
  useEffect(() => {
    const calculateRoute = async () => {
      if (!pickup || !dropoff || !isLoaded || !map) return;

      const routeKey = `${pickup}-${dropoff}`;
      if (routeKey === previousRoute.current && !pendingCalculation) return;

      try {
        if (directionsRendererRef.current) {
          directionsRendererRef.current.setMap(null);
          directionsRendererRef.current = null;
        }

        const routeDetails = await getRouteDetails(pickup, dropoff);
        if (routeDetails) {
          setDirections(routeDetails.route);
          onRouteCalculated?.(routeDetails);

          const route = routeDetails.route.routes[0].legs[0];
          
          // Create pickup marker
          const newPickupMarker = new google.maps.Marker({
            position: route.start_location,
            map,
            icon: createPinIcon('#34A853'),
            title: 'Pickup Location',
            label: {
              text: 'P',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold'
            }
          });
          setPickupMarker(newPickupMarker);

          // Create dropoff marker
          const newDropoffMarker = new google.maps.Marker({
            position: route.end_location,
            map,
            icon: createPinIcon('#EA4335'),
            title: 'Dropoff Location',
            label: {
              text: 'D',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 'bold'
            }
          });
          setDropoffMarker(newDropoffMarker);

          directionsRendererRef.current = new google.maps.DirectionsRenderer({
            map,
            directions: routeDetails.route,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: theme === 'dark' ? '#60A5FA' : '#007AFF',
              strokeWeight: 4,
              strokeOpacity: 0.8
            }
          });

          if (routeDetails.route.routes[0]?.bounds) {
            map.fitBounds(routeDetails.route.routes[0].bounds);
          }
          
          previousRoute.current = routeKey;
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        toast.error('Failed to calculate route');
      }
    };

    // Calculate route when pickup and dropoff are set or when pendingCalculation is true
    if ((pickup && dropoff) || pendingCalculation) {
      calculateRoute();
    }
  }, [pickup, dropoff, onRouteCalculated, isLoaded, map, theme, pendingCalculation]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-gray-500">Error loading maps</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-gray-500">Loading maps...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={15}
      center={center}
      options={{
        styles: theme === 'dark' ? darkModeStyle : undefined,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.BOTTOM_LEFT,
        },
        fullscreenControl: false,
        gestureHandling: 'greedy',
        disableDefaultUI: false
      }}
      onLoad={setMap}
    />
  );
}