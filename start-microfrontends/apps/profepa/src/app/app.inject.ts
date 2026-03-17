import { InjectionToken } from "@angular/core";
/**
 * Este token se utiliza para inyectar la configuración de la aplicación en el módulo de la aplicación.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const APPINJECT = new InjectionToken<any>(
    'Profepa Application config'
  );