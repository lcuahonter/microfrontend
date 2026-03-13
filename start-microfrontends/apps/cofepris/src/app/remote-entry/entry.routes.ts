import { Route } from '@angular/router';

/**
 * Rutas remotas para la aplicación.
 * 
 * @export
 * @const {Route[]}
 */
export const REMOTE_ROUTES: Route[] = [
  /**
   * Ruta por defecto que redirige a 'pago'.
   * 
   * @type {Route}
   */
  { path: '', redirectTo: 'pago', pathMatch: 'full' },

  /**
   * Ruta para el módulo de pago.
   * 
   * @type {Route}
   */
  {
    path: 'pago', 
    loadChildren: () => import('./../application/app.module').then(module => module.AppCofeprisModule)
  }
];