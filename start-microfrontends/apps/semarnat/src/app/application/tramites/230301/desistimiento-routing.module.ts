import {
  AcusePageComponent,
  SolicitanteComponent,
} from '@ng-mf/data-access-user';
import {
  RouterModule,
  Routes } from '@angular/router';
import { DesistimientoSolicitudComponent } from './pages/desistimiento-solicitud/desistimiento-solicitud.component';
import { NgModule } from '@angular/core';
import { PasoDosComponent } from './pages/paso-dos/paso-dos.component';
import { PasoUnoComponent } from './pages/paso-uno/paso-uno.component';
import { SolicitudComponent } from './component/solicitud/solicitud.component';

const ROUTES_SOLICITUDES: Routes = [
  {
    path: 'solicitud',
    component: DesistimientoSolicitudComponent,
    children: [
      {
        path: 'paso-uno',
        component: PasoUnoComponent,
        children: [
          { path: 'solicitante', component: SolicitanteComponent },
          { path: 'solicitud', component: SolicitudComponent },
          { path: '', redirectTo: 'solicitante', pathMatch: 'full' },
        ],
      },
      { path: 'paso-dos', component: PasoDosComponent },
      { path: '', redirectTo: 'paso-uno', pathMatch: 'full' },
    ],
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
  imports: [RouterModule.forChild(ROUTES_SOLICITUDES)],
  exports: [RouterModule]
})
export class SemarnatDesistimientoRoutingModule { }
