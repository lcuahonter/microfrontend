import { RouterModule, Routes } from '@angular/router';
import { CamCertificadoComponent } from './page/cam-certificado/cam-certificado.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110211',
      },
    },
    path: 'cam',
    component: CamCertificadoComponent,
  },
  {
    path: '',
    redirectTo: 'prosec',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ValidarCertificadoRoutingModule {}
