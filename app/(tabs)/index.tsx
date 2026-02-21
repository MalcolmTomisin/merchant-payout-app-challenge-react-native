import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BalanceCard } from '@/components/balance-card';
import { ActivityRow } from '@/components/activity-row';
import { useMerchantData } from '@/hooks/use-merchant-data';
import type { ActivityItem } from '@/types/api';

const RECENT_ACTIVITY_COUNT = 3;

export default function HomeScreen() {
  const { data, isLoading, isError, refetch } = useMerchantData();
  const router = useRouter();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" testID="loading-indicator" />
      </ThemedView>
    );
  }

  if (isError || !data) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText style={styles.errorText}>
          Something went wrong. Please try again.
        </ThemedText>
        <Pressable
          style={styles.retryButton}
          onPress={() => refetch()}
          accessibilityRole="button"
          accessibilityLabel="Retry"
        >
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const recentActivity = data.activity.slice(0, RECENT_ACTIVITY_COUNT);

  const renderActivityItem = ({ item, index }: { item: ActivityItem; index: number }) => (
    <ActivityRow
      item={item}
      showSeparator={index < recentActivity.length - 1}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Business Account</ThemedText>
      </ThemedView>

      <BalanceCard
        availableBalance={data.available_balance}
        pendingBalance={data.pending_balance}
        currency={data.currency}
      />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
      </ThemedView>

      <FlatList
        data={recentActivity}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        scrollEnabled={false}
      />

      <Pressable
        style={styles.showMoreButton}
        onPress={() => router.push('/modal')}
        accessibilityRole="button"
        accessibilityLabel="Show More"
      >
        <ThemedText style={styles.showMoreText}>Show More</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  showMoreButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#d4eaf7',
    alignItems: 'center',
  },
  showMoreText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '600',
  },
});
