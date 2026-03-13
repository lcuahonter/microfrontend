import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { ExportacionMineralesDeHierroComponent } from './pages/exportacion-minerales-de-hierro/exportacion-minerales-de-hierro.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: ExportacionMineralesDeHierroComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'solicitud'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ImportacionProductoPetroliferoRoutingModule { }
