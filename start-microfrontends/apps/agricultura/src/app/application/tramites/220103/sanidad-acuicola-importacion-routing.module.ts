import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SanidadAcuicolaImportacionComponent } from './pages/sanidad-acuicola-importacion-page/sanidad-acuicola-importacion.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SanidadAcuicolaImportacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class SanidadAcuicolaImportacionRoutingModule { }
