/**
 * @module ImmexRegistroDeSolicitudModalityRoutingModule
 * @description Módulo de enrutamiento para el registro de solicitud IMMEX modalidad ampliación subsecuente sensibles.
 * Define las rutas y los componentes asociados.
 */
import { ImmexRegistroSolicitudModalityComponent } from './pages/immex-registro-solicitud-modality/immex-registro-solicitud-modality.component';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

/**
 * @constant ROUTES_PERMISO
 * @description Rutas para el módulo de registro de solicitud IMMEX.
 */
export const ROUTES_PERMISO: Routes = [
  {
    path: 'immex-registro',
    component: ImmexRegistroSolicitudModalityComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '80203'
      }
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'immex-registro',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_PERMISO)],
  exports: [RouterModule]
})
export class ImmexRegistroDeSolicitudModalityRoutingModule { }
