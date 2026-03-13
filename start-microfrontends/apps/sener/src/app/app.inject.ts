import { InjectionToken } from "@angular/core";
/**
 * Este token se utiliza para inyectar la configuración de la aplicación en el módulo de la aplicación.
 */
export interface AppConfig {
  // Define your configuration properties here, for example:
  apiUrl: string;
  featureFlag?: boolean;
}

export const APPINJECT = new InjectionToken<AppConfig>(
    'Sener Application config'
  );