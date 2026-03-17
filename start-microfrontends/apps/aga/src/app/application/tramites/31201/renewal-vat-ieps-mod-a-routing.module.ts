import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

/**
 * @constant
 * @name ROUTES
 * @description
 * Arreglo de rutas para el módulo de aviso único de renovación.
 */
const ROUTES: Routes = [
  /**
   * Ruta para el componente de pantallas.
   * @path ''
   * @component PantallasComponent
   */
  {
    path: '',
    component: PantallasComponent
  },
  /**
   * Ruta predeterminada que redirige al componente de aviso de renovación.
   * @path ''
   * @redirectTo 'aviso-de-renovacion'
   */
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'aviso-de-renovacion'
  }
];

/**
 * @module RenewalVatIepsModARoutingModule
 * @description
 * Módulo de enrutamiento para el aviso único de renovación.
 * Importa y exporta la configuración de rutas definidas en el módulo.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RenewalVatIepsModARoutingModule {}
