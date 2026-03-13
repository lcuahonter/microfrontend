import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { ExportacionHidrocarburosComponent } from './pages/exportacion-hidrocarburos/exportacion-hidrocarburos.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: ExportacionHidrocarburosComponent
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
export class ExportacionHidrocarburosRoutingModule { }
