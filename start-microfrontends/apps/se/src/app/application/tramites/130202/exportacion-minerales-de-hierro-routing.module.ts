import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { ExportacionMineralesDeHierroComponent } from './pages/exportacion-minerales-de-hierro/exportacion-minerales-de-hierro.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src/core/resolvers/iniciar-tramite.resolver';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
      data: {
        iniciarConfig: {
          procedureId: '130202',
        },
      },
    path: 'exportacion-mineralesde-hierro',
    component: ExportacionMineralesDeHierroComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'exportacion-mineralesDe-hierro'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ExportacionMineralesDeHierroRoutingModule { }
