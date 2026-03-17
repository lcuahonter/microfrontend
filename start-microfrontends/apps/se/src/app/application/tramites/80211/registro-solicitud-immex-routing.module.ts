import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { registroSolicitudImmexComponent } from './pages/registro-solicitud-immex/registro-solicitud-immex.component';

const ROUTES: Routes = [
  {
    path: 'modalidad-ampliacion-terciarizadoras',
    component: registroSolicitudImmexComponent,
    canActivate: [IniciarTramiteResolver],
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
      iniciarConfig: {
        procedureId: '80211',
      },
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'modalidad-ampliacion-terciarizadoras',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class registroSolicitudImmexRoutingModule {}
