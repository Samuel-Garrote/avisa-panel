import { create } from '@tiendanube/nexo';
import { config } from './config';

// Single connection between the panel and the Tiendanube admin it is embedded in
export const nexo = create({
  clientId: config.tiendanubeClientId,
  log: import.meta.env.DEV,
});
