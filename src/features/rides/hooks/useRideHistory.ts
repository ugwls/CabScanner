import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveRide } from '../api';
import type { SaveRideParams } from '../types';
import type { RouteDetails } from '../../../services/maps';
import type { RideOption } from '../../../types/ride';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-hot-toast';

export function useRideHistory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate: saveRideHistory, error } = useMutation({
    mutationFn: (params: SaveRideParams) => saveRide(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      toast.success('Ride saved to history');
    },
    onError: (error) => {
      console.error('Error saving ride:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save ride');
    }
  });

  const saveRideToHistory = (
    selectedRide: RideOption,
    routeDetails: RouteDetails,
    locations: { pickup: string; dropoff: string }
  ) => {
    if (!user) {
      toast.error('Please sign in to save ride history');
      return;
    }

    // Log the ride being saved
    console.log('Saving ride to history:', {
      pickup: locations.pickup,
      dropoff: locations.dropoff,
      distance: routeDetails.distance,
      duration: routeDetails.duration,
      price: selectedRide.price,
      provider: selectedRide.provider
    });

    saveRideHistory({
      pickup_location: locations.pickup,
      dropoff_location: locations.dropoff,
      distance: routeDetails.distance,
      duration: routeDetails.duration,
      price: selectedRide.price,
      provider: selectedRide.provider,
    });
  };

  return { saveRideToHistory, error };
}