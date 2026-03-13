import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PeruCertificadoComponent } from './page/peru-certificado/peru-certificado.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110205',
      },
    },
    path: 'peru',
    component: PeruCertificadoComponent,
  },
  {
    path: '',
    redirectTo: 'peru',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ValidarCertificadoRoutingModule {}
