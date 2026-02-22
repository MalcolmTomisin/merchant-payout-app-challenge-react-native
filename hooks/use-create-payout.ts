/**
 * Hook for creating a payout via the API
 * Uses TanStack Query mutation with automatic cache invalidation
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayout } from '@/services/api';
import { MERCHANT_QUERY_KEY } from '@/hooks/use-merchant-data';
import { ACTIVITY_QUERY_KEY } from '@/hooks/use-paginated-activity';

export function useCreatePayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayout,
    onSuccess: () => {
      // Invalidate merchant and activity data so balances refresh
      queryClient.invalidateQueries({ queryKey: MERCHANT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY });
    },
  });
}
