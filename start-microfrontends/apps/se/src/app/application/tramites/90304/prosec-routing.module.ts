import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { PantallasComponent } from './pages/pantallas/pantallas.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '90304',
      },
    },
    path: 'solicitud-modificaciones',
    component: PantallasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ProsecRoutingModule { }
