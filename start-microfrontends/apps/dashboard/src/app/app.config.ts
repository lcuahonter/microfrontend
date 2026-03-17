import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APPINJECT } from './app.inject';
import { ApplicationConfig } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ENVIRONMENT } from './environments/environment';
import { appRoutes } from './app.routes';
import { httpInterceptorFn } from '@ng-mf/data-access-user';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';


/**
 * Esta es la configuración principal de la aplicación Agace.
 * Aquí se definen los proveedores y la configuración de la aplicación.
 * Se utiliza para establecer la detección de cambios, las rutas y el cliente HTTP. 
 */
export const APPCONFIG: ApplicationConfig = {
  providers: [provideRouter(appRoutes),
  provideHttpClient(withInterceptors([httpInterceptorFn])),
  provideAnimations(),
  provideToastr(),
  { provide: APPINJECT, useValue: ENVIRONMENT },
  BsModalService
  ],
};
