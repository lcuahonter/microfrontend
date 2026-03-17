import { InjectionToken } from "@angular/core";
/**
 * Este token se utiliza para inyectar la configuración de la aplicación en el módulo de la aplicación.
 */

export interface AppConfig {
  URL_SERVER: string,
  URL_SERVER_UPLOAD: string,
  URL_SERVER_JSON_AUXILIAR: string,
  MOCK: boolean
}

export const APPINJECT = new InjectionToken<AppConfig>(
    'Inbal Application config'
  );