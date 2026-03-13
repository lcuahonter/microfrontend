import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';

const ROUTES_CONTENEDOR: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110216',
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
export class InicialmenteCertificadoOrigenRoutingModule {}
