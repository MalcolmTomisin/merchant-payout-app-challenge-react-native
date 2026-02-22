import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface TransactionContentProps {
  onDismiss: () => void;
  children?: React.ReactNode;
}

export function TransactionContent({
  onDismiss,
  children,
}: TransactionContentProps) {

  const tint = useThemeColor({}, "tint");
  const separatorColor = useThemeColor({}, "icon");

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Recent Activity</ThemedText>
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Done"
        >
          <ThemedText style={[styles.doneText, { color: tint }]}>
            Done
          </ThemedText>
        </Pressable>
      </View>
      <View
        style={[styles.headerSeparator, { backgroundColor: separatorColor }]}
      />
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  doneText: { fontSize: 17, fontWeight: "600" },
  headerSeparator: { height: StyleSheet.hairlineWidth, opacity: 0.3 },
});
