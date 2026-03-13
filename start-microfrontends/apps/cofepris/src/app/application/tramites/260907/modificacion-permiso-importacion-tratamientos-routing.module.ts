import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ModificacionPermisoImportacionTratamientosComponent } from './pages/modificacion-permiso-importacion-tratamientos/modificacion-permiso-importacion-tratamientos.component';

const ROUTES: Routes = [
   {
      path: 'solicitante',
      component: ModificacionPermisoImportacionTratamientosComponent,
    }
   
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionPermisoImportacionTratamientosRoutingModule { }
