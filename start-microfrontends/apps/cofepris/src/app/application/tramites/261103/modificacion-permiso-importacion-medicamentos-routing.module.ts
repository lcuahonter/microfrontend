import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DatosComponent } from './pages/datos/datos.component';

const ROUTES: Routes = [
  {
    path:'modificacion-permiso-importacion-medicamentos',
    component: DatosComponent,

  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'modificacion-permiso-importacion-medicamentos',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ModificacionPermisoImportacionMedicamentosRoutingModule { }
