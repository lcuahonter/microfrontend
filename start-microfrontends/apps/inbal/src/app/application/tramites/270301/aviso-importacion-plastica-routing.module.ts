import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
    path:'Pantallas',
    component:PantallasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AvisoImportacionPlasticaRoutingModule { }
