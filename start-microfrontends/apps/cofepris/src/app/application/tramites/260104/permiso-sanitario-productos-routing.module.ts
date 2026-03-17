import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@ng-mf/data-access-user';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
          iniciarConfig: {
          procedureId: '260104'
          }
        }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PermisoSanitarioProductosRoutingModule { }
