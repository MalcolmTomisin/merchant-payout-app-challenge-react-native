import { useEffect } from "react";
import { Alert } from "react-native";
import { addScreenshotListener } from "@/modules/screen-security";

export function useScreenshotListener() {
  useEffect(() => {
    const subscription = addScreenshotListener(() => {
      Alert.alert(
        "Security Reminder",
        "Please keep your financial data private. Screenshots may contain sensitive information.",
      );
    });
    return () => subscription.remove();
  }, []);
}
