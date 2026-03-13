import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SolicitudExpedicionPageComponent } from './pages/solicitud-expedicion-page/solicitud-expedicion-page.component';

// Definición de las rutas para el módulo
const ROUTES: Routes = [
  {
      canActivate: [IniciarTramiteResolver],
      data: {
        iniciarConfig: {
          procedureId: '120204',
        },
      },
      path: 'solicitud-expedicion',
      component: SolicitudExpedicionPageComponent,
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'solicitud-expedicion',
    },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ExpedicionCertificadoRoutingModule { }
