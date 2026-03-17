import { AcusePageComponent } from './components/acuse-page/acuse-page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudDeReporteComponent } from './pages/registro-solicitud-anual/solicitud-de-reporte.component';

const ROUTES: Routes = [
  {
    path: 'solicitud',
    component: SolicitudDeReporteComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ReporteAnualRoutingModule {}
