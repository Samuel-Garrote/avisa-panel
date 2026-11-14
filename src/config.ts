// Values come from .env.development (npm run dev) or .env.production (npm run build)
export const config = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  tiendanubeClientId: import.meta.env.VITE_TIENDANUBE_CLIENT_ID as string,
  // false in production until Stripe takes real payments: the Pro plan shows "coming soon"
  billingEnabled: import.meta.env.VITE_BILLING_ENABLED === 'true',
};
