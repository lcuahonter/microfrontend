/* eslint-disable sort-imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatosComponent } from './pages/datos/datos.component';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';

const ROUTES: Routes = [
  {
    path: 'datos',
    component: DatosComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'datos',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class AvisodematerialesRoutingModule {}
