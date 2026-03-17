/**
 * Módulo de enrutamiento para la funcionalidad de "Permiso de Importación de Calidad".
 * 
 * Este módulo define las rutas relacionadas con la funcionalidad de "pantallas" dentro de la aplicación.
 * 
 * @module ParmisoImportacionCalidadRoutingModule
 */
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { PantallasComponent } from './pages/pantallas/pantallas.component';

/**
 * Rutas definidas para el módulo de "Permiso de Importación de Calidad".
 * 
 * - `pantallas`: Ruta que carga el componente `PantallasComponent`.
 */
const ROUTES: Routes = [  
   {
      path: 'pantallas',
      component: PantallasComponent,
      canActivate: [IniciarTramiteResolver],
      resolve: { iniciarResolverData: IniciarTramiteResolver },
      data: {
      iniciarConfig: {
        procedureId: '260514'
      }
    }
    },
];

/**
 * Módulo de enrutamiento para "Permiso de Importación de Calidad".
 * 
 * Este módulo importa y exporta el módulo de enrutamiento de Angular configurado con las rutas definidas.
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ParmisoImportacionCalidadRoutingModule { }
