import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ImportacionOtrosVehiculosUsadosPageComponent } from './pages/importacion-otros-vehiculos-usados-page/importacion-otros-vehiculos-usados-page.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '130104',
      },
    },
    path: 'solicitud',
    component: ImportacionOtrosVehiculosUsadosPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportacionOtrosVehiculosUsadosRoutingModule { }
