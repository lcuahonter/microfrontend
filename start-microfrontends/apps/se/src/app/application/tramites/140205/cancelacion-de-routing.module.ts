import { RouterModule, Routes } from '@angular/router';
import { CancelacionDeCupoComponent } from './pages/cancelacion-de-cupo/cancelacion-de-cupo.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: CancelacionDeCupoComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '140205',
      },
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CancelacionDeRoutingModule {}
