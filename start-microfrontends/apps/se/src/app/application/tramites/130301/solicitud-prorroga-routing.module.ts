import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { InvocarComponent } from './pages/invocar-page/invocar-page.component';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

/**
 * Módulo de enrutamiento para la funcionalidad de solicitud de prórroga.
 * Define las rutas y los resolutores necesarios para la página de solicitud de prórroga.
 * @module SolicitudProrrogaRoutingModule
 */
const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130301',
          },
        },
      path: 'invocar',
      component: InvocarComponent,
  },
  {
    path: 'solicitud',
    component: SolicitudPageComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'invocar',
  },
];

/**
 * Módulo de enrutamiento para la solicitud de prórroga.
 * Configura las rutas y exporta el RouterModule.
 * @module SolicitudProrrogaRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SolicitudProrrogaRoutingModule { }
