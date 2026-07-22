import { useCallback, useState } from 'react';
import { useCopilot } from 'react-native-copilot';

export function useTourStart(isDark: boolean, toggleTheme: () => void) {
  const { start } = useCopilot();
  const [toastVisible, setToastVisible] = useState(false);

  const startTour = useCallback(() => {
    if (isDark) {
      toggleTheme();
      setToastVisible(true);
      setTimeout(() => start(), 350);
    } else {
      start();
    }
  }, [isDark, toggleTheme, start]);

  const dismissToast = useCallback(() => setToastVisible(false), []);

  return { startTour, toastVisible, dismissToast };
}
