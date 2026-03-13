import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { TodosPasosComponent } from '../pages/todos-pasos/todos-pasos.component';

/**
 * Rutas para el módulo de importaciones agropecuarias.
 * Define la ruta principal que carga el componente TodosPasosComponent
 * y utiliza el resolver IniciarTramiteResolver para la activación de la ruta.
 * @constant ROUTES - Array de rutas configuradas para el módulo.
 */
const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130107',
          },
        },
    path: 'permisos-de-importacia',
    component: TodosPasosComponent
  }
];

/**
 * Módulo de enrutamiento para importaciones agropecuarias.
 * Configura las rutas específicas para el módulo de importaciones agropecuarias.
 * @export
 * @class ImportacionesAgropecuariasRoutingModule
 * @typedef {ImportacionesAgropecuariasRoutingModule}
 * @description Módulo de enrutamiento para importaciones agropecuarias.
 * Configura las rutas específicas para el módulo de importaciones agropecuarias.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
/**
 * Clase ImportacionesAgropecuariasRoutingModule
 * Módulo de enrutamiento para importaciones agropecuarias.
 * Configura las rutas específicas para el módulo de importaciones agropecuarias.
 * @export
 * @class ImportacionesAgropecuariasRoutingModule
 * @typedef {ImportacionesAgropecuariasRoutingModule}
 * @description Módulo de enrutamiento para importaciones agropecuarias.
 * Configura las rutas específicas para el módulo de importaciones agropecuarias.
 */
export class ImportacionesAgropecuariasRoutingModule { }
