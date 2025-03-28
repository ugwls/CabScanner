interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  google: {
    mapsApiKey: string;
  };
}

function validateEnv(): EnvConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const missingVars = [];
  
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  if (!googleMapsApiKey) missingVars.push('VITE_GOOGLE_MAPS_API_KEY');

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    return {
      supabase: {
        url: supabaseUrl || 'MISSING_URL',
        anonKey: supabaseAnonKey || 'MISSING_KEY',
      },
      google: {
        mapsApiKey: googleMapsApiKey || 'MISSING_KEY',
      },
    };
  }

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
    google: {
      mapsApiKey: googleMapsApiKey,
    },
  };
}

export const env = validateEnv();