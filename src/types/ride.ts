export interface RideOption {
  provider: 'Uber' | 'Ola' | 'Rapido';
  type: string;
  price: number;
  eta: number;
  displayPrice: string;
  displayEta: string;
}