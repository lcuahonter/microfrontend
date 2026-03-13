import { InjectionToken } from "@angular/core";
/**
 * Este token se utiliza para inyectar la configuración de la aplicación en el módulo de la aplicación.
 */

export interface AppConfigInterface {
  URL_SERVER: string;
  URL_SERVER_UPLOAD: string;
  URL_SERVER_JSON_AUXILIAR: string;
  MOCK: boolean;
  REMOTE_APPS: {
    login: string;
    agace: string;
    aga: string;
    agricultura: string;
    se: string;
    semarnat: string;
    funcionario: string;
    cofepris: string;
    sener: string;
    amecafe: string;
    inbal: string;
    sedena: string;
    profepa: string;
    inah: string;
    crt: string;
    stps: string;
    bandejas: string;
    consultas: string;
    configuracion: string;
    tareas: string;
    usuarios: string;
    tramites: string;
  };
}
export const APPINJECT = new InjectionToken<AppConfigInterface>(
    'Dashboard Application config'
  );