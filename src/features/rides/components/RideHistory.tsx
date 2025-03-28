import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRideHistory } from '../api';
import { RideCard } from './RideCard';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import { cn } from '../../../lib/utils';
import { History } from 'lucide-react';

export function RideHistory() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { data: rides, isLoading, error, refetch } = useQuery({
    queryKey: ['rides'],
    queryFn: getRideHistory,
    enabled: !!user // Only run the query if user is authenticated
  });

  React.useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  if (!user) {
    return (
      <div className={cn(
        "p-6 text-center",
        theme === 'dark' ? "text-gray-400" : "text-gray-500"
      )}>
        <p>Please sign in to view your ride history</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!rides?.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className={cn(
        "text-lg font-semibold flex items-center gap-2",
        theme === 'dark' ? "text-white" : "text-gray-900"
      )}>
        <History size={18} />
        Your Ride History
      </h3>
      <div className="space-y-3">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-6 text-center text-gray-500">
      <div className="animate-pulse">
        Loading ride history...
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: unknown }) {
  return (
    <div className="p-6 text-center">
      <p className="text-red-500 font-medium">Failed to load ride history</p>
      <p className="text-sm text-gray-500 mt-2">
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-6 text-center text-gray-500">
      <p>No rides found in your history</p>
      <p className="text-sm mt-2">Book a ride to see it here</p>
    </div>
  );
}