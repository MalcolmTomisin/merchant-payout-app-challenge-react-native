/**
 * Hook to initialize MSW in development mode
 */
import { useEffect, useState } from 'react';

export function useMSW() {
  const [isReady, setIsReady] = useState(!__DEV__);

  useEffect(() => {
    if (__DEV__) {
      const enableMocking = async () => {
        // Server imports polyfills automatically, so we can import directly
        const { server } = await import('./server');

        console.log('Starting MSW server', server);
        server.listen();
        setIsReady(true);
      };

      enableMocking().catch((error) => {
        console.error('Failed to enable MSW:', error);
        // Still set ready to true to prevent blocking the app
        setIsReady(true);
      });
    }
  }, []);

  return isReady;
}
