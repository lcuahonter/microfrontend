import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ModificacionPermisoMedsUsoComponent } from './pages/modificacion-permiso-meds-uso/modificacion-permiso-meds-uso.component';

const ROUTES: Routes = [
   {
      path: 'solicitante',
      component: ModificacionPermisoMedsUsoComponent,
    }
   
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionPermisoMedsUsoRoutingModule { }
