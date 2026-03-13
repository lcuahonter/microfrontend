import { RouterModule, Routes } from '@angular/router';
import { FitosanitarioPageComponent } from './pages/fitosanitario-page/fitosanitario-page.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: 'fitosanitario',
    component: FitosanitarioPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'modalidad',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class InspeccionFitosanitarioRoutingModule { }
