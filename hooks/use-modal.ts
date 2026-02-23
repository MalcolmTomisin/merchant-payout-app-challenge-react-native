import { useState } from "react";

/**
 * useModal — generic toggle for modal/picker visibility.
 */
export function useModal(initial = false) {
  const [visible, setVisible] = useState(initial);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return { visible, open, close } as const;
}
