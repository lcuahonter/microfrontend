import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { MedicamentosDonacionComponent } from './pages/medicamentos-donacion/medicamentos-donacion.component';

const ROUTES: Routes = [
   {
      path: 'solicitante',
      component: MedicamentosDonacionComponent,
    }
   
  
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MedicamentosDonacionComponentRoutingModule { }
