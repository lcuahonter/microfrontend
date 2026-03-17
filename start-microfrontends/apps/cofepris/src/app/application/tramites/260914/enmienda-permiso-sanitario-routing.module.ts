import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { EnmiendaPermisoSanitarioComponent } from './pages/enmienda-permiso-sanitario/enmienda-permiso-sanitario.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';


const ROUTES: Routes = [
  {   
     canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260914'
      }
    },
    
    path:'pantallas',
    component:EnmiendaPermisoSanitarioComponent,

  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pantallas',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EnmiendaPermisoSanitarioRoutingModule { }
