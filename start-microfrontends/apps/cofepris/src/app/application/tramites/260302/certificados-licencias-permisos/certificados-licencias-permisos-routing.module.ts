import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TodospasosComponent } from '../pages/todospasos/todospasos.component';

const ROUTES: Routes = [
  {
    path: 'contenedor-de-pasos',
    component: TodospasosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class CertificadosLicenciasPermisosRoutingModule { }
