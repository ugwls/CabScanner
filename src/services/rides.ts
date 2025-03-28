interface RideProviderDetails {
  name: string;
  price: string;
  eta: string;
}

interface RideTypeDetails {
  ola: RideProviderDetails;
  uber: RideProviderDetails;
  rapido: RideProviderDetails;
}

export interface RidePrices {
  auto: RideTypeDetails;
  bike: RideTypeDetails;
  mini: RideTypeDetails;
  sedan: RideTypeDetails;
  suv: RideTypeDetails;
}

export interface RideLinks {
  uber_link: string;
  ola_link: string;
  rapido_data: {
    pickupLocation: {
      lat: number;
      lng: number;
    };
    dropLocation: {
      lat: number;
      lng: number;
    };
    customer: string;
  };
}

export async function fetchRidePrices(links: RideLinks): Promise<RidePrices> {
  try {
    const response = await fetch(
      'https://nodejs-serverless-function-express-seven-jet.vercel.app/api/hello',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(links),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Error fetching ride prices:', error);
    throw error;
  }
}

export function convertPriceStringToNumber(price: string): number {
  if (!price || price === 'Not Available') return 0;
  // Remove the ₹ symbol and convert to number
  return Number(price.replace('₹', '').replace(',', ''));
}

export function formatRideOptions(prices: RidePrices) {
  const options: Array<{
    type: string;
    provider: 'Uber' | 'Ola' | 'Rapido';
    price: number;
    eta: number;
    displayPrice: string;
    displayEta: string;
  }> = [];

  Object.entries(prices).forEach(([type, providers]) => {
    // Add Uber option if price exists and is not "Not Available"
    if (providers.uber.price && providers.uber.price !== 'Not Available') {
      options.push({
        type: providers.uber.name,
        provider: 'Uber',
        price: convertPriceStringToNumber(providers.uber.price),
        eta: parseInt(providers.uber.eta) || 0,
        displayPrice: providers.uber.price,
        displayEta: providers.uber.eta || 'N/A',
      });
    }

    // Add Ola option if price exists and is not "Not Available"
    if (providers.ola.price && providers.ola.price !== 'Not Available') {
      options.push({
        type: providers.ola.name,
        provider: 'Ola',
        price: convertPriceStringToNumber(providers.ola.price),
        eta: parseInt(providers.ola.eta) || 0,
        displayPrice: providers.ola.price,
        displayEta: providers.ola.eta || 'N/A',
      });
    }

    // Add Rapido option if price exists and is not "Not Available"
    if (providers.rapido.price && providers.rapido.price !== 'Not Available') {
      options.push({
        type: providers.rapido.name,
        provider: 'Rapido',
        price: convertPriceStringToNumber(providers.rapido.price),
        eta: parseInt(providers.rapido.eta) || 0,
        displayPrice: providers.rapido.price,
        displayEta: providers.rapido.eta || 'N/A',
      });
    }
  });

  return options;
}