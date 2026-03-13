import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TodospasosComponent } from '../pages/todos-pasos/todos-pasos.component';

const ROUTES: Routes = [
  {
    path: 'registrar-solicitud',
    component: TodospasosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ComercioExteriorRoutingModule { }
