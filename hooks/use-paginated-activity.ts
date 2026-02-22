/**
 * Hook for fetching paginated activity using infinite scroll
 * Uses TanStack Query's useInfiniteQuery for cursor-based pagination
 */
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPaginatedActivity } from '@/services/api';

export const ACTIVITY_QUERY_KEY = ['activity'] as const;

export function usePaginatedActivity(limit: number = 15) {
  return useInfiniteQuery({
    queryKey: ACTIVITY_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchPaginatedActivity(pageParam, limit),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    staleTime: 30_000,
    retry: 1,
  });
}
