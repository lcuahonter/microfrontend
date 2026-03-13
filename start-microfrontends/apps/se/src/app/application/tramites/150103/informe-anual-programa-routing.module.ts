import { AcusePageComponent, IniciarTramiteResolver } from '@libs/shared/data-access-user/src';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { SolicitudDeReporteComponent } from './pages/solicitud-de-reporte/solicitud-de-reporte.component';

const ROUTES: Routes = [
  {
    canActivate: [IniciarTramiteResolver],
    data: {
      iniciarConfig: {
        procedureId: '150103'
      }
    },
    path: 'solicitud-de-reporte',
    component: SolicitudDeReporteComponent,
   },
   {
    path: 'acuse',
    component: AcusePageComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class InformeAnualProgramaRoutingModule { }
