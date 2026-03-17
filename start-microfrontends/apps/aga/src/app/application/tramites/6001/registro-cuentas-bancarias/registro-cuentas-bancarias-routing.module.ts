/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sort-imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodospasosComponent } from '../pages/todospasos/todospasos.component';

const routes: Routes = [
  {
    path: 'todospasos',
    component: TodospasosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroCuentasBancariasRoutingModule { }
