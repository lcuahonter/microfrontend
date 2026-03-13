
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SolicitudPageComponent } from './pages/solicitud-page/solicitud-page.component';
import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
export const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudPageComponent,
    canActivate: [IniciarTramiteResolver],
    resolve: { iniciarResolverData: IniciarTramiteResolver },
    data: {
      iniciarConfig: {
        procedureId: '40401'
      }
    }
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
  exports: [RouterModule]
})
export class Tramite40401RoutingModule { }
