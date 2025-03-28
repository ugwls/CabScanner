import React, { useState, useMemo } from 'react';
import { Car, Users, ChevronDown, ChevronUp, ArrowUpDown, Loader2, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { type RideOption } from '../../types/ride';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

interface PriceComparisonProps {
  options: RideOption[];
  onSelect: (option: RideOption) => void;
  isLoading?: boolean;
  links?: {
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
  };
}

type SortKey = 'price' | 'eta';
type SortOrder = 'asc' | 'desc';
type Provider = 'Uber' | 'Ola' | 'Rapido' | 'all';

interface SortState {
  key: SortKey;
  order: SortOrder;
}

const getProviderColor = (provider: 'Uber' | 'Ola' | 'Rapido'): string => {
  switch (provider) {
    case 'Uber':
      return 'bg-[#000000]';
    case 'Ola':
      return 'bg-[#45B748]';
    case 'Rapido':
      return 'bg-[#FFCA28]';
    default:
      return 'bg-gray-400';
  }
};

const getProviderIndicator = (provider: 'Uber' | 'Ola' | 'Rapido') => {
  return (
    <div className="flex items-center space-x-1">
      <div className={cn(
        "w-2 h-2 rounded-full",
        getProviderColor(provider)
      )} />
    </div>
  );
};

export function PriceComparison({ options, onSelect, isLoading = false, links }: PriceComparisonProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [sort, setSort] = useState<SortState>({ key: 'price', order: 'asc' });
  const [selectedProvider, setSelectedProvider] = useState<Provider>('all');
  const [showRecommended, setShowRecommended] = useState(true);

  const handleSelect = (option: RideOption) => {
    onSelect(option);
    
    if (!links) return;

    // Open the appropriate URL based on the provider
    switch (option.provider) {
      case 'Uber': {
        const uberUrl = new URL(links.uber_link);
        const params = new URLSearchParams(uberUrl.search);
        const newUberUrl = new URL('https://m.uber.com/looking');
        newUberUrl.search = params.toString();
        window.open(newUberUrl.toString(), '_blank');
        break;
      }
      case 'Ola': {
        const olaUrl = new URL(links.ola_link);
        const params = new URLSearchParams(olaUrl.search);
        const newOlaUrl = new URL('https://olawebcdn.com/assets/ola-universal-link.html');
        newOlaUrl.search = params.toString();
        window.open(newOlaUrl.toString(), '_blank');
        break;
      }
      case 'Rapido':
        const { pickupLocation, dropLocation } = links.rapido_data;
        const rapidoUrl = `https://m.rapido.bike/unup-home/seo/${encodeURIComponent(pickupLocation.lat + ',' + pickupLocation.lng)}/${encodeURIComponent(dropLocation.lat + ',' + dropLocation.lng)}?version=v3`;
        window.open(rapidoUrl, '_blank');
        break;
    }
  };

  const handleSort = (key: SortKey) => {
    setSort(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleProviderFilter = (provider: Provider) => {
    setSelectedProvider(prev => prev === provider ? 'all' : provider);
  };

  const recommendedRides = useMemo(() => {
    const rideTypes = new Map<string, RideOption>();
    
    options.forEach(option => {
      const currentCheapest = rideTypes.get(option.type);
      if (!currentCheapest || option.price < currentCheapest.price) {
        rideTypes.set(option.type, option);
      }
    });

    return Array.from(rideTypes.values());
  }, [options]);

  const filteredAndSortedOptions = useMemo(() => {
    let filtered = options;
    
    if (selectedProvider !== 'all') {
      filtered = options.filter(option => option.provider === selectedProvider);
    }

    return [...filtered].sort((a, b) => {
      const value1 = a[sort.key];
      const value2 = b[sort.key];
      return sort.order === 'asc' ? value1 - value2 : value2 - value1;
    });
  }, [options, sort, selectedProvider]);

  return (
    <div className={cn(
      "backdrop-blur-md rounded-t-2xl shadow-lg",
      theme === 'dark' ? "bg-gray-800/90" : "bg-white/90"
    )}>
      <button 
        className={cn(
          "w-full p-4 border-b",
          "cursor-pointer select-none",
          "transition-colors",
          theme === 'dark'
            ? "border-gray-700 hover:bg-gray-700/50"
            : "border-gray-100 hover:bg-gray-50/50"
        )}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mb-4 mx-auto" />
        <div className="w-full flex items-center justify-between">
          <div className="flex-1">
            <h2 className={cn(
              "text-xl font-semibold text-left",
              theme === 'dark' ? "text-white" : "text-gray-900"
            )}>
              Available Rides
            </h2>
            {!user && (
              <p className={cn(
                "text-sm mt-1 text-left",
                theme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>
                Sign in to save your ride history
              </p>
            )}
          </div>
          <div className={cn(
            "p-2 rounded-full",
            theme === 'dark'
              ? "bg-gray-700/80 hover:bg-gray-600/80"
              : "bg-gray-100/80 hover:bg-gray-200/80",
            "transition-colors"
          )}>
            {isMinimized ? (
              <ChevronUp className={cn(
                "w-6 h-6",
                theme === 'dark' ? "text-gray-300" : "text-gray-600"
              )} />
            ) : (
              <ChevronDown className={cn(
                "w-6 h-6",
                theme === 'dark' ? "text-gray-300" : "text-gray-600"
              )} />
            )}
          </div>
        </div>
      </button>

      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          isMinimized ? "max-h-0" : "max-h-[60vh]",
          "overflow-hidden"
        )}
      >
        {/* Controls */}
        <div className={cn(
          "sticky top-0 px-4 pt-4 pb-2 z-10 backdrop-blur-md",
          theme === 'dark' ? "bg-gray-800/90" : "bg-white/90"
        )}>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowRecommended(!showRecommended)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm",
                "border transition-colors",
                showRecommended
                  ? theme === 'dark'
                    ? "bg-yellow-900/50 border-yellow-700 text-yellow-300"
                    : "bg-yellow-50 border-yellow-200 text-yellow-700"
                  : theme === 'dark'
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <Star className={cn(
                "w-4 h-4",
                showRecommended 
                  ? theme === 'dark' ? "fill-yellow-300" : "fill-yellow-400"
                  : theme === 'dark' ? "text-gray-500" : "text-gray-400"
              )} />
              <span>Recommended</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSort('price')}
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-lg text-sm",
                  "border transition-colors",
                  sort.key === 'price'
                    ? theme === 'dark'
                      ? "bg-blue-900/50 border-blue-700 text-blue-300"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                    : theme === 'dark'
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <span>Price</span>
                <ArrowUpDown className={cn(
                  "w-4 h-4 ml-1",
                  sort.key === 'price' && sort.order === 'desc' && "rotate-180"
                )} />
              </button>
              <button
                onClick={() => handleSort('eta')}
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-lg text-sm",
                  "border transition-colors",
                  sort.key === 'eta'
                    ? theme === 'dark'
                      ? "bg-blue-900/50 border-blue-700 text-blue-300"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                    : theme === 'dark'
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <span>Time</span>
                <ArrowUpDown className={cn(
                  "w-4 h-4 ml-1",
                  sort.key === 'eta' && sort.order === 'desc' && "rotate-180"
                )} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleProviderFilter('Uber')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm",
                "border transition-colors",
                selectedProvider === 'Uber'
                  ? "bg-[#000000] border-[#000000] text-white"
                  : theme === 'dark'
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
              )}
            >
              Uber
            </button>
            <button
              onClick={() => handleProviderFilter('Ola')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm",
                "border transition-colors",
                selectedProvider === 'Ola'
                  ? "bg-[#45B748] border-[#45B748] text-white"
                  : theme === 'dark'
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
              )}
            >
              Ola
            </button>
            <button
              onClick={() => handleProviderFilter('Rapido')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm",
                "border transition-colors",
                selectedProvider === 'Rapido'
                  ? "bg-[#FFCA28] border-[#FFCA28] text-black"
                  : theme === 'dark'
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
              )}
            >
              Rapido
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(60vh-120px)]">
          <div className="p-4 space-y-4">
            {/* Recommended Rides Section */}
            {showRecommended && recommendedRides.length > 0 && (
              <div className="space-y-3">
                <h3 className={cn(
                  "text-sm font-medium flex items-center",
                  theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )}>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-2" />
                  Recommended Rides
                </h3>
                {recommendedRides.map((option, index) => (
                  <button
                    key={`recommended-${index}`}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border",
                      "transition-colors duration-200",
                      "focus:outline-none focus:ring-2",
                      theme === 'dark'
                        ? "bg-yellow-900/20 border-yellow-700/50 hover:bg-yellow-900/30 focus:ring-yellow-500/20"
                        : "bg-yellow-50/50 border-yellow-100 hover:bg-yellow-50 focus:ring-yellow-500/20"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        theme === 'dark' ? "bg-yellow-900/50" : "bg-yellow-100"
                      )}>
                        {option.type.toLowerCase().includes('bike') || option.type.toLowerCase().includes('moto') ? (
                          <Users className={cn(
                            "w-5 h-5",
                            theme === 'dark' ? "text-yellow-300" : "text-yellow-700"
                          )} />
                        ) : (
                          <Car className={cn(
                            "w-5 h-5",
                            theme === 'dark' ? "text-yellow-300" : "text-yellow-700"
                          )} />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <p className={cn(
                            "font-medium",
                            theme === 'dark' ? "text-white" : "text-gray-900"
                          )}>{option.type}</p>
                          {getProviderIndicator(option.provider)}
                        </div>
                        <p className={cn(
                          "text-sm",
                          theme === 'dark' ? "text-gray-400" : "text-gray-500"
                        )}>Best price available</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        theme === 'dark' ? "text-white" : "text-gray-900"
                      )}>{option.displayPrice}</p>
                      <p className={cn(
                        "text-sm",
                        theme === 'dark' ? "text-gray-400" : "text-gray-500"
                      )}>{option.displayEta}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* All Available Rides */}
            <div className="space-y-3">
              <h3 className={cn(
                "text-sm font-medium",
                theme === 'dark' ? "text-gray-400" : "text-gray-500"
              )}>All Available Rides</h3>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <span className={cn(
                    "ml-2",
                    theme === 'dark' ? "text-gray-400" : "text-gray-600"
                  )}>Loading prices...</span>
                </div>
              ) : filteredAndSortedOptions.length > 0 ? (
                filteredAndSortedOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border",
                      "transition-colors duration-200",
                      "focus:outline-none focus:ring-2",
                      theme === 'dark'
                        ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 focus:ring-blue-500/20"
                        : "bg-white/50 border-gray-100 hover:bg-gray-50/50 focus:ring-blue-500/20"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        theme === 'dark' ? "bg-gray-700" : "bg-gray-100"
                      )}>
                        {option.type.toLowerCase().includes('bike') || option.type.toLowerCase().includes('moto') ? (
                          <Users className={cn(
                            "w-5 h-5",
                            theme === 'dark' ? "text-gray-300" : "text-gray-700"
                          )} />
                        ) : (
                          <Car className={cn(
                            "w-5 h-5",
                            theme === 'dark' ? "text-gray-300" : "text-gray-700"
                          )} />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center space-x-2">
                          <p className={cn(
                            "font-medium",
                            theme === 'dark' ? "text-white" : "text-gray-900"
                          )}>{option.type}</p>
                          {getProviderIndicator(option.provider)}
                        </div>
                        <p className={cn(
                          "text-sm",
                          theme === 'dark' ? "text-gray-400" : "text-gray-500"
                        )}>{option.displayEta}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "font-semibold",
                      theme === 'dark' ? "text-white" : "text-gray-900"
                    )}>{option.displayPrice}</span>
                  </button>
                ))
              ) : (
                <div className={cn(
                  "text-center py-8",
                  theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )}>
                  No rides available at the moment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}