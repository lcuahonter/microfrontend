import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AsignacionDirectaDeCupoComponent } from './pages/asignacion-directa-de-cupo/asignacion-directa-de-cupo.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [

  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '120402'
      }
    },
    path: 'solicitante',
    component: AsignacionDirectaDeCupoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AsignacionDirectaDeCupoRoutingModule { }
