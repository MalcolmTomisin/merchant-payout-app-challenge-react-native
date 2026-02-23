import { useThemeColor } from "@/hooks/use-theme-color";

/**
 * useFormInputColors — resolves theme-aware colors for form inputs.
 */
export function useFormInputColors() {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor(
    { light: "#E0E0E0", dark: "#3A3A3C" },
    "icon",
  );
  const placeholderColor = useThemeColor(
    { light: "#9CA3AF", dark: "#6B7280" },
    "icon",
  );
  const inputBg = useThemeColor(
    { light: "#fff", dark: "#1C1E21" },
    "background",
  );

  return { textColor, borderColor, placeholderColor, inputBg } as const;
}
