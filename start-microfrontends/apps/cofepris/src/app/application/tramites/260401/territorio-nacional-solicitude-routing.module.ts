import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { TerritorioNacionalSolicitudeComponent } from './pages/territorio-nacional-solicitude/territorio-nacional-solicitude.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260401'
      }
    },
      path: 'solicitante',
      component: TerritorioNacionalSolicitudeComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class TerritorioNacionalSolicitudeRoutingModule { }
