import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TransactionRow } from "@/components/transaction-row";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { ActivityItem } from "@/types/api";

interface TransactionListProps {
  activities: ActivityItem[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onDismiss: () => void;
}

export function TransactionList({
  activities,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onDismiss,
}: TransactionListProps) {
  const tint = useThemeColor({}, "tint");

  const renderItem = ({
    item,
    index,
  }: {
    item: ActivityItem;
    index: number;
  }) => (
    <TransactionRow item={item} showSeparator={index < activities.length - 1} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator
          size="small"
          color={tint}
          testID="pagination-loader"
        />
        <ThemedText style={styles.loadingMoreText}>Loading more...</ThemedText>
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  };

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      testID="transaction-list"
    />
  );
}

const styles = StyleSheet.create({
  footer: { paddingVertical: 20, alignItems: "center" },
  loadingMoreText: { marginTop: 8, fontSize: 14, opacity: 0.6 },
});
