import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { PermisoImportacionBiologicaComponent } from './pages/permiso-importacion-biologica/permiso-importacion-biologica.component';

const ROUTES:Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260402'
      }
    },
    path:'solictud',
    component:PermisoImportacionBiologicaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EntradaHumanaRoutingModule { }
