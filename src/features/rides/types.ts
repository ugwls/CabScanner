export interface SavedRide {
  id: string;
  user_id: string;
  pickup_location: string;
  dropoff_location: string;
  distance: string;
  duration: string;
  price: number;
  provider: string;
  created_at: string;
}

export interface SaveRideParams {
  pickup_location: string;
  dropoff_location: string;
  distance: string;
  duration: string;
  price: number;
  provider: string;
}