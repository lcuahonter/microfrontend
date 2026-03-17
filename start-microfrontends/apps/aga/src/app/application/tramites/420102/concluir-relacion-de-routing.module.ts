import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

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
  {
    path: 'solicitud',
    component: SolicitantePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ConcluirRelacionDeRoutingModule { }
