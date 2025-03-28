import { supabase } from '../../../lib/supabase';
import type { SavedPlace, AddPlaceParams, UpdatePlaceParams } from '../types';

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User must be authenticated to view saved places');
  }

  const { data, error } = await supabase
    .from('saved_places')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved places:', error);
    throw new Error('Failed to fetch saved places');
  }

  return data || [];
}

export async function addSavedPlace(params: AddPlaceParams): Promise<SavedPlace> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User must be authenticated to save places');
  }

  const { data, error } = await supabase
    .from('saved_places')
    .insert({
      user_id: userData.user.id,
      name: params.name,
      address: params.address,
      latitude: params.latitude,
      longitude: params.longitude
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving place:', error);
    throw new Error('Failed to save place');
  }

  return data;
}

export async function updateSavedPlace(id: string, params: UpdatePlaceParams): Promise<SavedPlace> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User must be authenticated to update places');
  }

  const { data, error } = await supabase
    .from('saved_places')
    .update({
      name: params.name,
      address: params.address,
      latitude: params.latitude,
      longitude: params.longitude
    })
    .eq('id', id)
    .eq('user_id', userData.user.id) // Add user_id check
    .select()
    .single();

  if (error) {
    console.error('Error updating place:', error);
    throw new Error('Failed to update place');
  }

  if (!data) {
    throw new Error('Place not found or access denied');
  }

  return data;
}

export async function deleteSavedPlace(id: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User must be authenticated to delete places');
  }

  const { error } = await supabase
    .from('saved_places')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id);

  if (error) {
    console.error('Error deleting place:', error);
    throw new Error('Failed to delete place');
  }
}