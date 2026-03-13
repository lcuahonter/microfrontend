import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { EnmiendaPermisoSanitarioComponent } from './pages/enmienda-permiso-sanitario/enmienda-permiso-sanitario.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  {
    path:'solictud',
    component:EnmiendaPermisoSanitarioComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260905'
      }
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solictud',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EnmiendaPermisoSanitarioRoutingModule { }
