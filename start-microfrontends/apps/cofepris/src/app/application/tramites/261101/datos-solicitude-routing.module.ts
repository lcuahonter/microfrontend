import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DatosComponent } from './pages/datos/datos.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  {
    path: 'solicitud-modificacion',
    component: DatosComponent,
     canActivate: [IniciarTramiteResolver],
        resolve: { iniciarResolverData: IniciarTramiteResolver },
        data: {
        iniciarConfig: {
          procedureId: '261101'
        }
      }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud-modificacion',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class DatosSolicitudeRoutingModule { }
