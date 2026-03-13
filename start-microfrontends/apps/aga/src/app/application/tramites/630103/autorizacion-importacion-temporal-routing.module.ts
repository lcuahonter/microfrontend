import { RouterModule, Routes } from '@angular/router';
import { AutorizacionImportacionTemporalComponent } from './pages/autorizacion-importacion-temporal/autorizacion-importacion-temporal.component';
import { NgModule } from '@angular/core';



const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: AutorizacionImportacionTemporalComponent,

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
export class AutorizacionImportacionTemporalRoutingModule { }
