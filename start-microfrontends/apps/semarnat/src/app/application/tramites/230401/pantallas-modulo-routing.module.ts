import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PasoCapturarSolicitudComponent } from './pages/paso-capturar-solicitud/paso-capturar-solicitud.component';

const ROUTES: Routes = [
  {
    path: 'action',
    component: PasoCapturarSolicitudComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'action',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PantallasModuloRoutingModule { }
