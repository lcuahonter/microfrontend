import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudModalidadPageComponent } from './pages/solicitud-modalidad-page/solicitud-modalidad-page.component';

export const ROUTES_SOLICITUD: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
      data: {
        iniciarConfig: {
          procedureId: '80208'
        }
      },
    path: 'modalidad',
    component: SolicitudModalidadPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'modalidad',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_SOLICITUD)],
  exports: [RouterModule]
})
export class RegistroSolicitudRoutingModule { }