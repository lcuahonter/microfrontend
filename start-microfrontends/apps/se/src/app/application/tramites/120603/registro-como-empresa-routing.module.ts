import { RouterModule, Routes } from '@angular/router';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RegistroEmpresaComponent } from './pages/registro-empresa/registro-empresa.component';

const ROUTES: Routes = [
  {
    path: 'registro-empresa',
    component: RegistroEmpresaComponent,
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '120603'
      }
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'registro-empresa',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class RegistroComoEmpresaRoutingModule { }
