import { supabase } from '../../../lib/supabase';
import type { SavedRide } from '../types';

export async function getRideHistory(): Promise<SavedRide[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('User must be authenticated to view ride history');
  }

  // Since RLS is disabled, we need to filter by user_id in the query
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ride history:', error);
    throw new Error('Failed to fetch ride history');
  }

  return data || [];
}