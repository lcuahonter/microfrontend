import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TodosPasosComponent } from '../pages/todos-pasos/todos-pasos.component';

const ROUTES: Routes = [
  {
    path: 'registro-solicitud32612',
    component: TodosPasosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class EsquemaDeCertificacionRoutingModule { }
