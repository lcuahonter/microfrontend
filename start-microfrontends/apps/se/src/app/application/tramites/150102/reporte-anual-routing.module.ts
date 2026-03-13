import { AcusePageComponent } from './components/acuse-page/acuse-page.component';
import { IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SolicitudDeReporteComponent } from './pages/solicitud-de-reporte/solicitud-de-reporte.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '150102'
      }
    },
    path: 'solicitud',
    component: SolicitudDeReporteComponent,
  },
  {
    path: 'acuse',
    component: AcusePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ReporteAnualRoutingModule {}
