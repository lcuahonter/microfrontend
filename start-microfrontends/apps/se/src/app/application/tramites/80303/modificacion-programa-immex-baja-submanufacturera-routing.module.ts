import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RegistroSolicitudComponent } from './components/registro-solicitud/registro-solicitud.component';

const ROUTES: Routes = [
    {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '80303',
      },
    },
    path: 'registro-solicitude',
    component: RegistroSolicitudComponent,
  },
   {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro-solicitud',
  },

  {
    path: 'solicitud',
    component: SolicitudPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ModificacionProgramaImmexBajaSubmanufactureraRoutingModule {}