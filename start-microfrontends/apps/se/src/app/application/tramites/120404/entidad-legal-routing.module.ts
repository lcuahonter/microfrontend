import { RouterModule, Routes } from '@angular/router';
import { AsignciondirectaPageComponent } from './pages/asignciondirecta-page/asignciondirecta-page.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '120404',
      },
    },
    path: 'soliciante',
    component: AsignciondirectaPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class EntidadLegalRoutingModule {}
