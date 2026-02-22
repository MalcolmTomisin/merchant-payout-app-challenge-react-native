import { useRouter } from 'expo-router';

import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { MerchantOverview } from '@/components/merchant-overview';
import { useMerchantData } from '@/hooks/use-merchant-data';

export default function HomeScreen() {
  const { data, isLoading, isError, refetch } = useMerchantData();
  const router = useRouter();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <MerchantOverview
      data={data}
      onShowMore={() => router.push('/modal')}
    />
  );
}
