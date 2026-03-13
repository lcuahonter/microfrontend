import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

export const ROUTES_SOLICITUDES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110204',
      },
    },
    path: 'certificado-origen',
    component: SolicitudPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'certificado-origen',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_SOLICITUDES)],
  exports: [RouterModule],
})
export class PeximRoutingModule {}
