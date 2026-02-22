/**
 * API Service Layer
 * Pure async functions wrapping fetch calls to the merchant API
 */
import { API_BASE_URL } from '@/constants';
import type {
  MerchantDataResponse,
  PaginatedActivityResponse,
  CreatePayoutRequest,
  PayoutResponse,
} from '@/types/api';

/**
 * Fetch merchant overview data (balance + recent activity)
 */
export async function fetchMerchantData(): Promise<MerchantDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/merchant`);

  if (!response.ok) {
    throw new Error(`Failed to fetch merchant data: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch paginated activity items
 * @param cursor - Activity ID to start after (null for first page)
 * @param limit - Number of items per page
 */
export async function fetchPaginatedActivity(
  cursor: string | null = null,
  limit: number = 15
): Promise<PaginatedActivityResponse> {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  params.set('limit', String(limit));

  const response = await fetch(`${API_BASE_URL}/api/merchant/activity?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch activity: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a payout to a bank account
 * Amount should be in the lowest denomination (pence/cents)
 */
export async function createPayout(request: CreatePayoutRequest): Promise<PayoutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.error ?? `Payout failed: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
