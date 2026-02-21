/**
 * Hook for fetching merchant overview data
 * Uses TanStack Query for caching, loading states, and error handling
 */
import { useQuery } from '@tanstack/react-query';
import { fetchMerchantData } from '@/services/api';

export const MERCHANT_QUERY_KEY = ['merchant'] as const;

export function useMerchantData() {
  return useQuery({
    queryKey: MERCHANT_QUERY_KEY,
    queryFn: fetchMerchantData,
    staleTime: 30_000, // Consider data fresh for 30 seconds
    retry: 1,
  });
}
