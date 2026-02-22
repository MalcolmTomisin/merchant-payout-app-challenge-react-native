/**
 * MerchantOverview — presentational component for the merchant home screen.
 * Displays balance card, recent activity list, and a "Show More" action.
 */
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BalanceCard } from '@/components/balance-card';
import { ActivityRow } from '@/components/activity-row';
import type { MerchantDataResponse, ActivityItem } from '@/types/api';

const RECENT_ACTIVITY_COUNT = 3;

interface MerchantOverviewProps {
  /** The full merchant data response */
  data: MerchantDataResponse;
  /** Callback invoked when the user taps "Show More" */
  onShowMore: () => void;
}

export function MerchantOverview({ data, onShowMore }: MerchantOverviewProps) {
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
        onPress={onShowMore}
        accessibilityRole="button"
        accessibilityLabel="Show More"
      >
        <ThemedText style={styles.showMoreText}>
          Show More
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 12,
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
