
import { ModificacionPermisoSanitarioComponent } from './pages/modificacion-permiso-sanitario/modificacion-permiso-sanitario.component';

import { NgModule } from '@angular/core';

import {RouterModule , Routes} from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
const ROUTES: Routes = [
  {
        path: 'solicitante',
        component: ModificacionPermisoSanitarioComponent,
        canActivate: [IniciarTramiteResolver],
            data: {
              iniciarConfig: {
                procedureId: '260902'
              }
        },
    },
     {
      path: '', pathMatch: 'full', redirectTo: 'solicitante' 
    }
  //  {
  //     path: 'solicitante',
  //     component: ModificacionPermisoSanitarioComponent,
  //   }
   
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionPermisoSanitarioRoutingModule { }
