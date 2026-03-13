import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_ROUTES } from './app.routes';
import { ENVIRONMENT } from './environments/environment';
import { httpInterceptorFn} from '@ng-mf/data-access-user';
import { provideRouter } from '@angular/router';

import { APPINJECT } from './app.inject';

/**
 * Esta es la configuración principal de la aplicación Agace.
 * Aquí se definen los proveedores y la configuración de la aplicación.
 * Se utiliza para establecer la detección de cambios, las rutas y el cliente HTTP. 
 */
export const APPCONFIG: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    { provide: APPINJECT, useValue: ENVIRONMENT },
    provideHttpClient(withInterceptors([httpInterceptorFn])),
  ],
};
