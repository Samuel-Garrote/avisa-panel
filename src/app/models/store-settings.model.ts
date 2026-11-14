// Same as the backend PanelController SettingsRequest / SettingsResponse (GET and PUT /panel/settings)
export interface StoreSettings {
  // {product} and {url} are replaced when sending
  messageTemplate: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
}

// Same limit as the backend (StoreSettings.MAX_MESSAGE_LENGTH)
export const MAX_MESSAGE_LENGTH = 1000;
