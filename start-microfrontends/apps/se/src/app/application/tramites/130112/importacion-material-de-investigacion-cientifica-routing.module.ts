import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ImportacionMaterialDeInvestigacionCientificaComponent } from './pages/importacion-material-de-investigacion-cientifica/importacion-material-de-investigacion-cientifica.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

/**
 * @descripcion
 * Constante que define las rutas para el módulo de importación de material de investigación científica.
 * Incluye la ruta principal y una redirección por defecto.
 */
const ROUTES: Routes = [
  {
     canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130112',
          },
        },
    path: 'importacion-material-de-investigacion-cientifica',
    component: ImportacionMaterialDeInvestigacionCientificaComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'importacion-material-de-investigacion-cientifica',
  },
];

/**
 * @descripcion
 * Módulo de enrutamiento para el trámite de importación de material de investigación científica.
 * Este módulo define las rutas y las configura para ser utilizadas en el módulo principal.
 *
 * @decorador @NgModule
 */
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ImportacionMaterialDeInvestigacionCientificaRoutingModule {}