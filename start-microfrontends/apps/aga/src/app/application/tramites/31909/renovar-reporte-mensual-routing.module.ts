import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RenovarReporteComponent } from './pages/reactivar-reporte/renovar-reporte.component';

const ROUTES: Routes = [
  {
    path: '',
    component: RenovarReporteComponent,
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
export class RenovarReporteMensualRoutingModule {}
