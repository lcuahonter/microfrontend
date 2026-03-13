import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

/**
 * @module AvisoModificacionCertificacionModule
 * @description
 * Módulo de enrutamiento para el aviso único de renovación. Define las rutas para los componentes relacionados con el trámite.
 */
const ROUTES: Routes = [
  /**
   * Ruta para el componente de pantallas.
   * @path 'pantallas'
   * @component PantallasComponent
   */
  {
    path: 'pantallas',
    component: PantallasComponent,
  },
  /**
   * Ruta predeterminada que redirige al componente de aviso de renovación.
   * @path ''
   * @redirectTo 'aviso-modification-certificacion'
   */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aviso-modification-certificacion',
  },
];

/**
 * @NgModule
 * @description
 * Configuración del módulo de enrutamiento. Importa y exporta las rutas definidas.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
/**
 * @description
 * Módulo de enrutamiento para la funcionalidad de aviso único de renovación.
 * Este módulo gestiona las rutas relacionadas con la modificación y certificación de avisos.
 *
 * @class
 * @see Angular Routing](https://angular.io/guide/router)
 *
 */
export class AvisoUnicoRenovacionRoutingModule {}
