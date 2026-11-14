// Same shapes as the backend DTOs

// GET /panel/metrics (GetDashboardMetricsUseCase.DashboardMetrics)
export interface DashboardMetrics {
  // Every request ever made in the store
  requested: number;
  // Requests already notified
  notified: number;
  // Requests still waiting for stock
  pending: number;
}

// GET and PUT /panel/settings (PanelController SettingsRequest / SettingsResponse)
export interface StoreSettings {
  // {product} and {url} are replaced when sending
  messageTemplate: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
}

// Same limit as the backend (StoreSettings.MAX_MESSAGE_LENGTH)
export const MAX_MESSAGE_LENGTH = 1000;

// Same as the backend Plan enum
export type Plan = 'FREE' | 'PRO';

// GET /panel/billing (GetBillingUseCase.BillingInfo)
export interface Billing {
  plan: Plan;
  // Stripe status: active, trialing, past_due, canceled...
  status: string;
  notificationLimit: number;
  notificationsThisMonth: number;
}

// POST /panel/billing/session
export interface BillingSession {
  url: string;
}
