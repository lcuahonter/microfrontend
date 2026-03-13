import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DesmantelarComponent } from './pages/desmantelar/desmantelar.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';


const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
        data: {
          iniciarConfig: {
            procedureId: '130106',
          },
        },
      path: 'solicitante',
      component: DesmantelarComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
   exports: [RouterModule]
})
export class DesmantelarRoutingModule { }
