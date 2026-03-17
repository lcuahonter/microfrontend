import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

/**
 * Definición de las rutas `ROUTES_EXENCIAN_IMPUESTORS` utilizadas en la aplicación.
 * Cada ruta está configurada para navegar a un componente específico.
 */
export const ROUTES_EXENCIAN_IMPUESTORS: Routes = [

  {
      /**
       * Ruta para la página de solicitud de modificación de exención de impuestos.
       * Se asigna el componente `SolicitudPageComponent` para su visualización.
       */
      path: 'modification-exencion-impuestos',
      component: SolicitudPageComponent,
  },

  {
      /**
       * Ruta por defecto cuando se accede a la base de la aplicación.
       * Redirige automáticamente a `modification-exencion-impuestos`.
       */
      path: '',
      pathMatch: 'full',
      redirectTo: 'modification-exencion-impuestos',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_EXENCIAN_IMPUESTORS)],
  exports: [RouterModule],
})
export class ExencionImpuestosRoutingModule {}
