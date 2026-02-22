/**
 * Transaction List Modal — displays all activity items with infinite scroll.
 * Uses cursor-based pagination via usePaginatedActivity hook.
 */
import { FlatList, Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionRow } from '@/components/transaction-row';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { usePaginatedActivity } from '@/hooks/use-paginated-activity';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ActivityItem } from '@/types/api';

export default function ModalScreen() {
  const router = useRouter();
  const tint = useThemeColor({}, 'tint');
  const separatorColor = useThemeColor({}, 'icon');

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedActivity();

  // Flatten all pages into a single array
  const activities = data?.pages.flatMap((page) => page.items) ?? [];

  const renderItem = ({ item, index }: { item: ActivityItem; index: number }) => (
    <TransactionRow
      item={item}
      showSeparator={index < activities.length - 1}
    />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={tint} testID="pagination-loader" />
        <ThemedText style={styles.loadingMoreText}>Loading more...</ThemedText>
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Recent Activity</ThemedText>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Done"
        >
          <ThemedText style={[styles.doneText, { color: tint }]}>Done</ThemedText>
        </Pressable>
      </View>

      <View style={[styles.headerSeparator, { backgroundColor: separatorColor }]} />

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          testID="transaction-list"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  doneText: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerSeparator: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.6,
  },
});
