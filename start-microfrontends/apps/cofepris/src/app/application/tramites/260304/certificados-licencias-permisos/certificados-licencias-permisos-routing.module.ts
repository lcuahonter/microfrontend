import { RouterModule, Routes } from '@angular/router';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { TodospasosComponent } from '../pages/todospasos/todospasos.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '260304',
      },
    },
    path: 'contenedor-de-pasos',
    component: TodospasosComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contenedor-de-pasos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class CertificadosLicenciasPermisosRoutingModule { }
