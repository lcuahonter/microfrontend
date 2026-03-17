import { SanidadComponent } from './pages/sanidad/sanidad.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
      path: 'solicitante',
      component: SanidadComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
   exports: [RouterModule]
})
export class SanidadRoutingModule { }
