import { supabase } from '../../lib/supabase';
import type { SavedRide, SaveRideParams } from './types';

export async function getRideHistory(): Promise<SavedRide[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Since RLS is disabled, we need to filter by user_id in the query
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ride history:', error);
    throw new Error(`Failed to fetch ride history: ${error.message}`);
  }
  
  return data || [];
}

export async function saveRide(params: SaveRideParams): Promise<SavedRide> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  // Log the request for debugging
  console.log('Saving ride with params:', {
    ...params,
    user_id: user.user.id
  });

  // With RLS disabled, we need to ensure we're setting the user_id correctly
  const { data, error } = await supabase
    .from('rides')
    .insert({
      user_id: user.user.id,
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