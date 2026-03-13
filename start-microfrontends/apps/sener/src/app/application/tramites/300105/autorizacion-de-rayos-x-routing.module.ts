import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AutorizacionDatosComponent } from './pages/autorizacion-datos/autorizacion-datos.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: AutorizacionDatosComponent,
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
export class AutorizacionDeRayosXRoutingModule { }
