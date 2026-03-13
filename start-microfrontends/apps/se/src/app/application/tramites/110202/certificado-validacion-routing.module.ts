import { RouterModule, Routes } from '@angular/router';
import { CartificadoValidacionPageComponent } from './pages/cartificado-validacion-page/cartificado-validacion-page.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

export const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110202',
      },
    },
    path: 'validacion',
    component: CartificadoValidacionPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'modalidad',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CertificadoValidacionRoutingModule {}
