
import { ModificacionPermisoSanitarioLaSaludComponent } from './pages/modificacion-permiso-sanitario-la-salud/modificacion-permiso-sanitario-la-salud.component';

import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';


const ROUTES: Routes = [
   {
      path: 'solicitante',
      component: ModificacionPermisoSanitarioLaSaludComponent,
    }
   
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionPermisoSanitarioLaSaludRoutingModule { }
