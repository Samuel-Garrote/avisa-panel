import { getSessionToken } from '@tiendanube/nexo';
import { config } from './config';
import type { Billing, BillingSession, DashboardMetrics, StoreSettings } from './models';
import { nexo } from './nexo';

// Calls the Avisa backend with the Nexo session token.
// The token proves which store is using the panel (the backend checks it in NexoSessionTokenFilter),
// so there is no login of our own
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getSessionToken(nexo);
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Avisa API answered ${response.status} for ${path}`);
  }
  return (await response.json()) as T;
}

export const api = {
  getMetrics: () => request<DashboardMetrics>('/panel/metrics'),

  getSettings: () => request<StoreSettings>('/panel/settings'),

  // The backend returns the saved settings
  updateSettings: (settings: StoreSettings) =>
    request<StoreSettings>('/panel/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  getBilling: () => request<Billing>('/panel/billing'),

  // Stripe page to open: checkout (free plan) or customer portal (paid plan)
  createBillingSession: () => request<BillingSession>('/panel/billing/session', { method: 'POST' }),
};
