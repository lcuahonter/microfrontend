import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';


const ROUTES: Routes = [
  {
      path: 'pantallas', // Ruta para la página del solicitante
      component: SolicitantePageComponent, // Componente asociado a la ruta
      canActivate: [IniciarTramiteResolver],
              data: {
                iniciarConfig: {
                  procedureId: '140102'
                }
              }
    },
];
@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RegistroDeSolicitudRoutingModule { }
