import { useRouter } from "expo-router";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { TransactionContent } from "@/components/transaction-content";
import { TransactionList } from "@/components/transaction-list";
import { usePaginatedActivity } from "@/hooks/use-paginated-activity";

export default function ModalScreen() {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedActivity();

  if (isLoading) {
    return (
      <TransactionContent onDismiss={() => router.back()}>
        <LoadingState />
      </TransactionContent>
    );
  }

  if (isError) {
    return (
      <TransactionContent onDismiss={() => router.back()}>
        <ErrorState onRetry={() => refetch()} />
      </TransactionContent>
    );
  }

  const activities = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <TransactionContent onDismiss={() => router.back()}>
      <TransactionList
        activities={activities}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        onLoadMore={() => fetchNextPage()}
        onDismiss={() => router.back()}
      />
    </TransactionContent>
  );
}
