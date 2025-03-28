import { supabase } from '../../../lib/supabase';
import type { SavedRide, SaveRideParams } from '../types';

export async function saveRide(params: SaveRideParams): Promise<SavedRide> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User must be authenticated to save rides');
  }

  // Log the request for debugging
  console.log('Saving ride with params:', {
    ...params,
    user_id: userData.user.id
  });

  // With RLS disabled, we need to ensure we're setting the user_id correctly
  const { data, error } = await supabase
    .from('rides')
    .insert({
      user_id: userData.user.id,
      pickup_location: params.pickup_location,
      dropoff_location: params.dropoff_location,
      distance: params.distance,
      duration: params.duration,
      price: params.price,
      provider: params.provider
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving ride:', error);
    throw new Error(`Failed to save ride: ${error.message}`);
  }

  return data;
}