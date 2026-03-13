import { RouterModule, Routes } from '@angular/router';
import { AcusePageComponent } from '@libs/shared/data-access-user/src';
import { CancelarReporteComponent } from './pages/cancelar-reporte/cancelar-reporte.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    path: '',
    component: CancelarReporteComponent,
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
export class CancelarSolicitudReporteMensualRoutingModule {}
