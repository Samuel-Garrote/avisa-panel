// Same as the backend Plan enum
export type Plan = 'FREE' | 'PRO';

// Same as the backend GetBillingUseCase.BillingInfo (GET /panel/billing)
export interface Billing {
  plan: Plan;
  // Stripe status: active, trialing, past_due, canceled...
  status: string;
  // Notifications per month that apply now
  notificationLimit: number;
  notificationsThisMonth: number;
}

// Same as the backend PanelController BillingSessionResponse (POST /panel/billing/session)
export interface BillingSession {
  url: string;
}
