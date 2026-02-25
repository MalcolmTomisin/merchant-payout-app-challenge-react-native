import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from '@/constants/design-tokens';
import { scale } from '@/utils/scale';

export function PayoutFormContent({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{title}</ThemedText>
        </ThemedView>
        {children}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: scale(Spacing.base),
  },
  header: {
    marginBottom: scale(Spacing.section),
  },
});
