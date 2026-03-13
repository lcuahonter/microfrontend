import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APPINJECT } from './app.inject';
import { APP_ROUTES } from './app.routes';
import { ENVIRONMENT } from './environments/environment';
import { httpInterceptorFn } from '@ng-mf/data-access-user';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';

/**
 * Esta es la configuración principal de la aplicación CONFIGURACION.
 * Aquí se definen los proveedores y la configuración de la aplicación.
 * Se utiliza para establecer la detección de cambios, las rutas y el cliente HTTP. 
 */
export const APPCONFIG: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptors([httpInterceptorFn])),
    provideAnimations(),
    importProvidersFrom(ToastrModule.forRoot()),
    { provide: APPINJECT, useValue: ENVIRONMENT }
  ],
};
