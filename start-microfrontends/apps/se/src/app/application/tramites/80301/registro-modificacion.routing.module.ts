import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RegistroModificacionPageComponent } from './pages/registro-modificacion-page/registro-modificacion-page.component';
import { RegistroSolicitudComponent } from './components/registro-solicitud/registro-solicitud.component';

/**
 * Rutas para el módulo de registro y modificación del trámite 80301.
 * Define las rutas y componentes asociados para las funcionalidades de registro y modificación.
 * @constant {Routes} ROUTES_CONTENEDOR - Array de rutas para el módulo.
 */
const ROUTES_CONTENEDOR: Routes = [
  {
    path: 'registro-solicitud',
    component: RegistroSolicitudComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro-solicitud',
  },
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '80301',
      },
    },
    path: 'registro-modificacion-page',
    component: RegistroModificacionPageComponent,
  }
];

/**
 * Módulo de enrutamiento para el registro y modificación del trámite 80301.
 * Define las rutas y componentes asociados para las funcionalidades de registro y modificación.
 * @module RegistroModificacionRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES_CONTENEDOR)],
  exports: [RouterModule],
})

/**
 * Clase que representa el módulo de enrutamiento para el registro y modificación del trámite 80301.
 * @class RegistroModificacionRoutingModule
 */
export class RegistroModificacionRoutingModule {}