import { RouterModule, Routes } from '@angular/router';
import { AtenderRequerimientosPageComponent } from './atender-requerimientos-page/atender-requerimientos-page.component';
import { NgModule } from '@angular/core';

export const ROUTES_SOLICITUDES: Routes = [

  {
    path: '5701',
    component: AtenderRequerimientosPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '5701',
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES_SOLICITUDES)],
  exports: [RouterModule],
})
export class AtencionRequerimientosRoutingModule {}
