import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { ReactivarReporteComponent } from './pages/reactivar-reporte/reactivar-reporte.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ReactivarReporteComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ReactivarReporteMensualRoutingModule {}
