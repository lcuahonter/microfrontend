import { RouterModule, Routes } from '@angular/router';
import { DatosBusquedaComponent } from './components/datos-busqueda/datos-busqueda.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110209',
      },
    },
    path: 'solicitud',
    component: DatosBusquedaComponent,
  },
  {
    path: 'solicitud-page',
    component: SolicitudPageComponent,
  },
  {
    path: '',
    redirectTo: 'solicitud',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class CertificadoSGPRoutingModule {}
