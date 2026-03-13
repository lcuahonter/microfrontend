import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '110207',
      },
    },
    path: 'solicitud',
    component: SolicitudPageComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
