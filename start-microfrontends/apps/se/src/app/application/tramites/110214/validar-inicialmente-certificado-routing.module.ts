import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

const ROUTES_CONTENEDOR: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110214',
      },
    },
    path: 'solicitante',
    component: SolicitantePageComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitante',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_CONTENEDOR)],
  exports: [RouterModule],
})
export class ValidarInicialmenteCertificadoRoutingModule {}
