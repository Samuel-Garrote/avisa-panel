// Development: the panel runs on localhost:4200 inside the Tiendanube admin
export const environment = {
  production: false,
  // Avisa backend
  apiUrl: 'http://localhost:8081',
  // Public app id from the partners panel (not a secret)
  tiendanubeClientId: '51199',
  // Stripe in test mode: the Pro plan can be tried locally
  billingEnabled: true,
};
