// Production build (ng build): used automatically instead of environment.ts
export const environment = {
  production: true,
  // Avisa backend on Railway
  apiUrl: 'https://avisa-api.saasifylabs.net',
  // Public app id from the partners panel (not a secret)
  tiendanubeClientId: '51199',
  // false until Stripe is activated with real payments: the Pro plan shows "coming soon"
  billingEnabled: false,
};
