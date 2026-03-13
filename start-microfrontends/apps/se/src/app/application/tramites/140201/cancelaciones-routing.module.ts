import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { CancelacionesComponent } from './pages/cancelaciones/cancelaciones.component';

const ROUTES: Routes = [
    {
      path: 'solicitud',
      component:CancelacionesComponent ,
    },
   
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class CancelacionesRoutingModule { }
