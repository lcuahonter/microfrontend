import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

/**
 * @module AvisoUnicoRenovacionRoutingModule
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
    path: 'mod-aa',
    component: PantallasComponent,
  },
  /**
   * Ruta predeterminada que redirige al componente de aviso de renovación.
   * @path ''
   * @redirectTo 'aviso-de-renovacion'
   */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aviso-de-renovacion',
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
export class RenewalVatIepsModAAModuleRoutingModule {}
