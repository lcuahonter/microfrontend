import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { RenunciaDePermisoComponent } from './pages/renuncia-de-permiso/renuncia-de-permiso.component';

const ROUTES: Routes = [
   {
      path: 'solicitud',
      component: RenunciaDePermisoComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RenunciaDePermisoRoutingModule { }
