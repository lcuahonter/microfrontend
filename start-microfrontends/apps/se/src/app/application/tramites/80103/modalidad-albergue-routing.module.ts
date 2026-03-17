import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';

const ROUTES: Routes = [
   
    {
      canActivate: [IniciarTramiteResolver],
          data: {
            iniciarConfig: {
              procedureId: '80103'
            }
          },
      path: 'action',
      component: PasoCapturarSolicitudComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModalidadAlbergueRoutingModule { }