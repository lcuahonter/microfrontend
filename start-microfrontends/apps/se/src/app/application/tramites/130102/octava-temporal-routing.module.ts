import { RouterModule, Routes } from '@angular/router';
import { AcuseResolucionPageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { OctavaTemporalComponent } from './pages/octava-temporal/octava-temporal.component';

const ROUTES: Routes = [
  {
      path: 'solicitante',
      component: OctavaTemporalComponent,
    },
    {
        path: 'acuse-resolucion',
        component: AcuseResolucionPageComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
   exports: [RouterModule]
})
export class OctavaTemporalRoutingModule { }
