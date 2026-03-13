import { InjectionToken } from "@angular/core";

/**
 * Esta interfaz define la configuración de la aplicación Amecafe.
 * Se utiliza para inyectar la configuración en el módulo de la aplicación.
 */
export interface AppConfig {
  URL_SERVER: string,
  URL_SERVER_UPLOAD: string,
  URL_SERVER_JSON_AUXILIAR: string,
  MOCK: boolean
}
/**
 * Este token se utiliza para inyectar la configuración de la aplicación en el módulo de la aplicación.
 */
export const APPINJECT = new InjectionToken<AppConfig>(
    'Amecafe Application config'
  );