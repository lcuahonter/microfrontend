import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { RetornoImportacionTemporalComponent } from './pages/retorno-importacion-temporal-page/retorno-importacion-temporal-page.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: RetornoImportacionTemporalComponent,

  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud',
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RetornoImportacionTemporalRoutingModule { }
