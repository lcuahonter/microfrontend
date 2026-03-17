import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

import { RegistroSolicitudPageComponent } from './pages/registro-solicitud-page/registro-solicitud-page.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: RegistroSolicitudPageComponent,
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
export class DonacionesExtranjerasRoutingModule { }
