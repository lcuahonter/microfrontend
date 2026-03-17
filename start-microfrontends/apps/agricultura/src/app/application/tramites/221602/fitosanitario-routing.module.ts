import { FitosanitarioComponent } from './pages/fitosanitario/fitosanitario.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
      path: 'solicitante',
      component: FitosanitarioComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
   exports: [RouterModule]
})
export class FitosanitarioRoutingModule { }
