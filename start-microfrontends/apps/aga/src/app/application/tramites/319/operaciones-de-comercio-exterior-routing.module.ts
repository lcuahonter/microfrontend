import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

/**
 * @fileoverview Define las rutas para el módulo de operaciones de comercio exterior.
 *
 * @const ROUTES
 * @type {Routes}
 * @description
 * Este arreglo de rutas configura las rutas para el módulo de operaciones de comercio exterior.
 * Contiene las siguientes rutas:
 * - `exterior`: Muestra el componente `SolicitudPageComponent`.
 * - Ruta por defecto (`''`): Redirige automáticamente a la ruta `exterior`.
 *
 */
const ROUTES: Routes = [
  { path: 'exterior', component: SolicitudPageComponent },
  { path: 'acuse', component: AcusePageComponent },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'exterior',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class OperacionesDeComercioExteriorRoutingModule {}
