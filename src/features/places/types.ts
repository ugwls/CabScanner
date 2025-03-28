export interface SavedPlace {
  id: string;
  user_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface AddPlaceParams {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdatePlaceParams {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}