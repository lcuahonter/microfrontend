import { RouterModule, Routes } from '@angular/router';
import { ExpedicionCertificadosFronteraComponent } from './pages/expedicion-certificados-frontera/expedicion-certificados-frontera.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

const EXPEDICION_CERTIFICADOS_FRONTERA: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '120702'
          }
        },
    path: 'solicitante',
    component: ExpedicionCertificadosFronteraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(EXPEDICION_CERTIFICADOS_FRONTERA)],
  exports: [RouterModule],
})
export class ExpedicionCertificadosFronteraRoutingModule {}
