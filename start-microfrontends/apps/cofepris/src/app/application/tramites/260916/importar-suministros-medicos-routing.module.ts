import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ImportarSuministrosMedicosComponent } from './pages/importar-suministros-medicos/importar-suministros-medicos.component';

const ROUTES: Routes = [
  {
    path:'solictud',
    component:ImportarSuministrosMedicosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportarSuministrosMedicosRoutingModule { }
