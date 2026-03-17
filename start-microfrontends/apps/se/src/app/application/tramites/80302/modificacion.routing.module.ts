import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RegistroSolicitudComponent } from './components/registro-solicitud/registro-solicitud.component';
import { RouterModule, } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitantePageComponent } from './pages/solicitante-page/solicitante-page.component';
const ROUTES_CONTENEDOR: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '80302'
      }
    },
    path: 'registro-solicitud',
    component: RegistroSolicitudComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro-solicitud',
  },  
  {
    path: 'solicitante',
    component: SolicitantePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_CONTENEDOR)],
  exports: [RouterModule],
})
export class ModificacionRoutingModule { }
